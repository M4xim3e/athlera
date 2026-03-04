// src/data/warmups.js
// Échauffements et récupérations par focus de séance

export const WARMUPS = {
  PUSH: {
    fr: [
      { name: 'Cercles de bras',       duration: '60s',    instruction: 'Grands cercles vers l\'avant puis vers l\'arrière. Amplitude maximale.' },
      { name: 'Écart élastique',       duration: '2 × 15', instruction: 'Rétractez les omoplates. Gardez les coudes légèrement fléchis.' },
      { name: 'Pompe inclinée',        duration: '2 × 12', instruction: 'Mains surélevées sur un banc. Amplitude complète. Activation pectorale.' },
    ],
    en: [
      { name: 'Arm Circles',           duration: '60s',    instruction: 'Large circles forward then backward. Full range of motion.' },
      { name: 'Band Pull-Apart',       duration: '2 × 15', instruction: 'Retract scapulae fully. Keep elbows slightly bent.' },
      { name: 'Incline Push-Up',       duration: '2 × 12', instruction: 'Hands elevated on bench. Full ROM. Chest activation.' },
    ],
  },
  PULL: {
    fr: [
      { name: 'Chat-Vache',            duration: '10 rép.', instruction: 'Mobilisez la colonne thoracique. Lent et contrôlé.' },
      { name: 'Écart élastique',       duration: '2 × 15', instruction: 'Activez les deltoïdes postérieurs. Omoplates rétractées.' },
      { name: 'Suspension scapulaire', duration: '2 × 10', instruction: 'Suspension à la barre. Montez et descendez les omoplates sans fléchir les coudes.' },
    ],
    en: [
      { name: 'Cat-Cow Stretch',       duration: '10 reps', instruction: 'Mobilise thoracic spine. Slow and controlled.' },
      { name: 'Band Pull-Apart',       duration: '2 × 15', instruction: 'Activate rear delts. Scapulae retracted.' },
      { name: 'Scapular Hang',         duration: '2 × 10', instruction: 'Dead hang. Elevate and depress scapulae without bending elbows.' },
    ],
  },
  LEGS: {
    fr: [
      { name: 'Cercles de hanches',    duration: '60s/côté', instruction: 'Ouvrez la capsule articulaire. Grands cercles contrôlés.' },
      { name: 'Squat poids de corps',  duration: '2 × 15',   instruction: 'Lent et contrôlé. Talon au sol. Genou dans l\'axe du pied.' },
      { name: 'Pont fessier',          duration: '2 × 15',   instruction: 'Contraction 1s en haut. Activation des fessiers avant la séance lourde.' },
    ],
    en: [
      { name: 'Hip Circles',           duration: '60s/side', instruction: 'Open hip capsule. Large controlled circles.' },
      { name: 'Bodyweight Squat',      duration: '2 × 15',   instruction: 'Slow and controlled. Heels down. Knees tracking over toes.' },
      { name: 'Glute Bridge',          duration: '2 × 15',   instruction: '1s squeeze at top. Glute activation before heavy session.' },
    ],
  },
  FULL: {
    fr: [
      { name: 'Corde à sauter / Trot', duration: '3 min',   instruction: 'Élevez la température centrale. Intensité modérée.' },
      { name: 'Étirement du monde',    duration: '5/côté',   instruction: 'Fente avant + rotation thoracique. Mobilité globale.' },
      { name: 'Pompe-chenille',        duration: '5 rép.',   instruction: 'Inchworm + pompe. Activation corps entier.' },
    ],
    en: [
      { name: 'Jump Rope or Jog',      duration: '3 min',   instruction: 'Raise core temperature. Moderate intensity.' },
      { name: 'World\'s Greatest Stretch', duration: '5/side', instruction: 'Lunge + thoracic rotation. Global mobility.' },
      { name: 'Inchworm Push-Up',      duration: '5 reps',  instruction: 'Inchworm + push-up. Full body primer.' },
    ],
  },
  UPPER: {
    fr: [
      { name: 'Cercles de bras',       duration: '60s',    instruction: 'Amplitude maximale. Épaules déverrouillées.' },
      { name: 'Face pull élastique',   duration: '2 × 15', instruction: 'Coudes hauts. Rotation externe. Santé des épaules.' },
      { name: 'Rowing élastique',      duration: '2 × 12', instruction: 'Omoplates rétractées. Contrôle complet.' },
    ],
    en: [
      { name: 'Arm Circles',           duration: '60s',    instruction: 'Full range. Shoulders unlocked.' },
      { name: 'Band Face Pull',        duration: '2 × 15', instruction: 'Elbows high. External rotation. Shoulder health.' },
      { name: 'Band Row',              duration: '2 × 12', instruction: 'Scapulae retracted. Full control.' },
    ],
  },
  LOWER: {
    fr: [
      { name: 'Cercles de hanches',    duration: '60s/côté', instruction: 'Mobilité de hanche. Amplitude maximale.' },
      { name: 'Squat poids de corps',  duration: '2 × 15',   instruction: 'Profondeur complète. Talon au sol.' },
      { name: 'Fente arrière',         duration: '2 × 10',   instruction: 'Activation quadriceps et fessiers. Contrôle du genou.' },
    ],
    en: [
      { name: 'Hip Circles',           duration: '60s/side', instruction: 'Hip mobility. Full range.' },
      { name: 'Bodyweight Squat',      duration: '2 × 15',   instruction: 'Full depth. Heels down.' },
      { name: 'Reverse Lunge',         duration: '2 × 10',   instruction: 'Quad and glute activation. Knee control.' },
    ],
  },
}

export const COOLDOWNS = {
  PUSH: {
    fr: [
      { name: 'Étirement pecto porte', duration: '60s/côté', instruction: 'Bras à 90° contre le mur. Inclinez doucement le buste vers l\'avant.' },
      { name: 'Étirement épaule',      duration: '45s/côté', instruction: 'Bras croisé devant. Épaule abaissée. Pas de rotation du cou.' },
      { name: 'Étirement triceps',     duration: '30s/côté', instruction: 'Coude derrière la tête. Aidez avec l\'autre main.' },
    ],
    en: [
      { name: 'Doorway Chest Stretch', duration: '60s/side', instruction: 'Arm at 90° on wall. Gently lean torso forward.' },
      { name: 'Cross-Body Shoulder',   duration: '45s/side', instruction: 'Arm across chest. Shoulder depressed. No neck rotation.' },
      { name: 'Overhead Tricep',       duration: '30s/side', instruction: 'Elbow behind head. Assist with other hand.' },
    ],
  },
  PULL: {
    fr: [
      { name: 'Posture de l\'enfant',  duration: '90s',      instruction: 'Bras tendus devant. Respirez. Décompression vertébrale.' },
      { name: 'Suspension étirement',  duration: '2 × 30s',  instruction: 'Suspension à la barre. Décompression complète de la colonne.' },
      { name: 'Étirement biceps mur',  duration: '30s/côté', instruction: 'Paume sur le mur, doigts vers le bas. Pivotez doucement.' },
    ],
    en: [
      { name: 'Child\'s Pose',         duration: '90s',      instruction: 'Arms extended forward. Breathe. Spinal decompression.' },
      { name: 'Dead Hang Stretch',     duration: '2 × 30s',  instruction: 'Hang from bar. Full spinal decompression.' },
      { name: 'Bicep Wall Stretch',    duration: '30s/side', instruction: 'Palm on wall fingers down. Gently rotate away.' },
    ],
  },
  LEGS: {
    fr: [
      { name: 'Pigeon yoga',           duration: '90s/côté', instruction: 'Fessiers et fléchisseurs de hanche profonds. Respirez dans l\'étirement.' },
      { name: 'Étirement quadriceps',  duration: '45s/côté', instruction: 'Talon vers le fessier. Genou pointé vers le bas. Équilibre.' },
      { name: 'Ischio-jambiers assis', duration: '60s/côté', instruction: 'Inclinez depuis la hanche. Dos droit. Jambe tendue.' },
    ],
    en: [
      { name: 'Pigeon Pose',           duration: '90s/side', instruction: 'Deep hip flexor and glute. Breathe into the stretch.' },
      { name: 'Standing Quad Stretch', duration: '45s/side', instruction: 'Heel to glute. Knee pointing down. Balance.' },
      { name: 'Seated Hamstring',      duration: '60s/side', instruction: 'Hinge from hip. Flat back. Leg extended.' },
    ],
  },
  FULL: {
    fr: [
      { name: 'Chat-Vache lent',       duration: '10 lentes', instruction: 'Décomprimez la colonne. Très lent. Respirez.' },
      { name: 'Torsion dorsale',       duration: '60s/côté',  instruction: 'Allongé. Genoux d\'un côté. Épaules au sol.' },
      { name: 'Posture de l\'enfant',  duration: '90s',       instruction: 'Récupération finale. Respirez profondément.' },
    ],
    en: [
      { name: 'Slow Cat-Cow',          duration: '10 slow',   instruction: 'Decompress the spine. Very slow. Breathe.' },
      { name: 'Supine Twist',          duration: '60s/side',  instruction: 'Lying down. Knees to one side. Shoulders flat.' },
      { name: 'Child\'s Pose',         duration: '90s',       instruction: 'Final reset. Breathe deeply.' },
    ],
  },
  UPPER: {
    fr: [
      { name: 'Étirement pecto porte', duration: '60s/côté', instruction: 'Bras à 90°. Étirement complet des pectoraux.' },
      { name: 'Posture de l\'enfant',  duration: '90s',       instruction: 'Bras tendus. Décompression dorsale.' },
      { name: 'Étirement biceps mur',  duration: '30s/côté', instruction: 'Paume sur le mur. Rotation douce.' },
    ],
    en: [
      { name: 'Doorway Chest Stretch', duration: '60s/side', instruction: 'Arm at 90°. Full chest stretch.' },
      { name: 'Child\'s Pose',         duration: '90s',       instruction: 'Arms extended. Back decompression.' },
      { name: 'Bicep Wall Stretch',    duration: '30s/side', instruction: 'Palm on wall. Gentle rotation.' },
    ],
  },
  LOWER: {
    fr: [
      { name: 'Pigeon yoga',           duration: '90s/côté', instruction: 'Fessiers profonds. Respirez.' },
      { name: 'Étirement quadriceps',  duration: '45s/côté', instruction: 'Talon vers le fessier. Équilibre.' },
      { name: 'Ischio-jambiers assis', duration: '60s/côté', instruction: 'Depuis la hanche. Dos droit.' },
    ],
    en: [
      { name: 'Pigeon Pose',           duration: '90s/side', instruction: 'Deep glutes. Breathe.' },
      { name: 'Standing Quad Stretch', duration: '45s/side', instruction: 'Heel to glute. Balance.' },
      { name: 'Seated Hamstring',      duration: '60s/side', instruction: 'From hip. Flat back.' },
    ],
  },
}