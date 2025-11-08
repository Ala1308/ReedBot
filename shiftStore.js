const { db } = require('./firebase');

// Collection helpers
const colGuild = (gid) => db.collection('guilds').doc(gid);
const shiftsCol = (gid) => colGuild(gid).collection('shifts');
const appsCol = (gid, sid) => shiftsCol(gid).doc(sid).collection('applications');
const assignsCol = (gid) => colGuild(gid).collection('assignments');

/**
 * Create a new shift
 */
async function createShift(guildId, shift) {
  console.log('🔥 Firestore: Creating shift document...');
  console.log('Path:', `guilds/${guildId}/shifts/${shift.shiftId}`);
  console.log('Data:', JSON.stringify(shift, null, 2));
  
  try {
    const docRef = shiftsCol(guildId).doc(shift.shiftId);
    await docRef.set(
      { ...shift, createdAt: Date.now() },
      { merge: true }
    );
    console.log('✅ Firestore: Shift document created successfully!');
    
    // Verify it was written
    const doc = await docRef.get();
    console.log('✅ Firestore: Document exists:', doc.exists);
  } catch (error) {
    console.error('❌ Firestore: Error creating shift:', error);
    throw error;
  }
}

/**
 * Get a shift by ID
 */
async function getShift(guildId, shiftId) {
  const snap = await shiftsCol(guildId).doc(shiftId).get();
  return snap.exists ? snap.data() : null;
}

/**
 * Update shift status
 */
async function setShiftStatus(guildId, shiftId, status) {
  await shiftsCol(guildId).doc(shiftId).update({ status });
}

/**
 * Apply to a shift
 */
async function applyToShift(guildId, shiftId, userId, roleSnapshot) {
  await appsCol(guildId, shiftId).doc(userId).set(
    {
      userId,
      withdrawn: false,
      roleSnapshot: roleSnapshot || null,
      appliedAt: Date.now()
    },
    { merge: true }
  );
}

/**
 * Withdraw from a shift
 */
async function withdrawFromShift(guildId, shiftId, userId) {
  await appsCol(guildId, shiftId).doc(userId).set(
    { withdrawn: true },
    { merge: true }
  );
}

/**
 * List applicants for a shift
 */
async function listApplicants(guildId, shiftId, filterRole) {
  const snaps = await appsCol(guildId, shiftId).get();
  let rows = snaps.docs
    .map(d => d.data())
    .filter(a => !a.withdrawn);

  if (filterRole) {
    rows = rows.filter(a => 
      (a.roleSnapshot || '').toLowerCase() === filterRole.toLowerCase()
    );
  }

  rows.sort((a, b) => a.appliedAt - b.appliedAt);
  return rows;
}

/**
 * Assign a shift to a tutor
 */
async function assignShift(guildId, shiftId, userId, assignedBy) {
  const batch = db.batch();

  batch.set(
    assignsCol(guildId).doc(shiftId),
    {
      shiftId,
      userId,
      assignedBy,
      assignedAt: Date.now(),
      active: true
    },
    { merge: true }
  );

  batch.update(shiftsCol(guildId).doc(shiftId), { status: 'assigned' });

  await batch.commit();
}

/**
 * Unassign a shift
 */
async function unassignShift(guildId, shiftId) {
  await assignsCol(guildId).doc(shiftId).set(
    { active: false },
    { merge: true }
  );
  await setShiftStatus(guildId, shiftId, 'open');
}

/**
 * List assignments for a user (as tuteur)
 */
async function listMyAssignments(guildId, userId) {
  const snaps = await assignsCol(guildId)
    .where('userId', '==', userId)
    .where('active', '==', true)
    .get();
  return snaps.docs.map(d => d.data());
}

/**
 * List assignments made BY an admin
 */
async function listAssignmentsByAdmin(guildId, adminId) {
  const snaps = await assignsCol(guildId)
    .where('assignedBy', '==', adminId)
    .where('active', '==', true)
    .get();
  return snaps.docs.map(d => d.data());
}

module.exports = {
  createShift,
  getShift,
  setShiftStatus,
  applyToShift,
  withdrawFromShift,
  listApplicants,
  assignShift,
  unassignShift,
  listMyAssignments,
  listAssignmentsByAdmin,
};

