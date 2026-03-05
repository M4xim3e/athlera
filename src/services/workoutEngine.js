import { getExerciseWeights } from './userService'

// ─── DURÉE → NOMBRE D'EXERCICES ──────────────────
const durationToExCount = (duration) => {
  if (duration <= 30) return 4
  if (duration <= 45) return 5
  if (duration <= 60) return 6
  if (duration <= 75) return 7
  if (duration <= 90) return 8
  return 9
}

// ─── SETS SELON DURÉE ────────────────────────────
const durationToSets = (duration) => {
  if (duration <= 30) return 3
  if (duration <= 45) return 3
  if (duration <= 60) return 4
  return 4
}

// ─── SPLIT SELON FRÉQUENCE ───────────────────────
const getSplit = (freq) => {
  if (freq <= 2) return ['FULL', 'FULL']
  if (freq === 3) return ['PUSH', 'PULL', 'LEGS']
  if (freq === 4) return ['PUSH', 'PULL', 'LEGS', 'FULL']
  if (freq === 5) return ['PUSH', 'PULL', 'LEGS', 'PUSH', 'PULL']
  if (freq === 6) return ['PUSH', 'PULL', 'LEGS', 'PUSH', 'PULL', 'LEGS']
  return ['PUSH', 'PULL', 'LEGS', 'PUSH', 'PULL', 'LEGS', 'FULL']
}

// ─── BASE D'EXERCICES ────────────────────────────
// Structure : id, name_fr, name_en, muscle_group, muscles, type, equipment, sets, reps, rest, rpe, exec_fr, exec_en, tip_fr, tip_en, level

const EXERCISES = [

  // ════════════════════════════════
  // PUSH — PECS
  // ════════════════════════════════
  {
    id: 'bench_press_barbell',
    name_fr: 'Développé couché barre', name_en: 'Barbell Bench Press',
    muscle_group: 'chest', muscles: 'Pectoraux, Deltoïdes ant., Triceps',
    type: 'COMPOUND', equipment: 'barbell', block: 'chest',
    sets: 4, reps: '6-8', rest: 120, rpe: '8',
    level: ['INTERMEDIATE', 'ADVANCED'],
    exec_fr: 'Allongé sur le banc, barre au-dessus de la poitrine, descente contrôlée jusqu\'au sternum, poussée explosive.',
    exec_en: 'Lie on bench, bar above chest, controlled descent to sternum, explosive push.',
    tip_fr: 'Garde les omoplates rétractées et les pieds bien à plat.',
    tip_en: 'Keep shoulder blades retracted and feet flat on floor.',
  },
  {
    id: 'bench_press_dumbbell',
    name_fr: 'Développé couché haltères', name_en: 'Dumbbell Bench Press',
    muscle_group: 'chest', muscles: 'Pectoraux, Deltoïdes ant., Triceps',
    type: 'COMPOUND', equipment: 'dumbbell', block: 'chest',
    sets: 3, reps: '8-12', rest: 90, rpe: '8',
    level: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'],
    exec_fr: 'Haltères de chaque côté, descente en contrôlant la rotation des poignets, poussée jusqu\'à extension.',
    exec_en: 'Dumbbells on each side, descend controlling wrist rotation, push to extension.',
    tip_fr: 'Amplitude plus grande que la barre, meilleure activation pectorale.',
    tip_en: 'Greater range of motion than barbell, better chest activation.',
  },
  {
    id: 'incline_bench_press_barbell',
    name_fr: 'Développé incliné barre', name_en: 'Incline Barbell Press',
    muscle_group: 'chest', muscles: 'Pectoraux sup., Deltoïdes ant.',
    type: 'COMPOUND', equipment: 'barbell', block: 'chest',
    sets: 3, reps: '8-10', rest: 90, rpe: '8',
    level: ['INTERMEDIATE', 'ADVANCED'],
    exec_fr: 'Banc incliné à 30-45°, même technique que le développé couché.',
    exec_en: 'Bench at 30-45°, same technique as flat bench press.',
    tip_fr: 'L\'inclinaison cible mieux le faisceau supérieur du pec.',
    tip_en: 'Incline targets the upper pec better.',
  },
  {
    id: 'incline_bench_press_dumbbell',
    name_fr: 'Développé incliné haltères', name_en: 'Incline Dumbbell Press',
    muscle_group: 'chest', muscles: 'Pectoraux sup., Deltoïdes ant.',
    type: 'COMPOUND', equipment: 'dumbbell', block: 'chest',
    sets: 3, reps: '8-12', rest: 90, rpe: '8',
    level: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'],
    exec_fr: 'Banc incliné, haltères de chaque côté, poussée en arc vers le centre.',
    exec_en: 'Incline bench, dumbbells each side, press in arc toward center.',
    tip_fr: 'Converge les haltères en haut pour un pic de contraction.',
    tip_en: 'Converge dumbbells at top for peak contraction.',
  },
  {
    id: 'incline_chest_press_hammer',
    name_fr: 'Incline Chest Press Machine', name_en: 'Incline Chest Press Machine',
    muscle_group: 'chest', muscles: 'Pectoraux sup., Deltoïdes ant.',
    type: 'COMPOUND', equipment: 'machine', block: 'chest',
    sets: 3, reps: '10-12', rest: 75, rpe: '7',
    level: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'],
    exec_fr: 'Machine inclinée, poignées à hauteur d\'épaules, poussée jusqu\'à extension.',
    exec_en: 'Incline machine, handles at shoulder height, push to extension.',
    tip_fr: 'Idéal en fin de séance pour finir les pecs sans risque.',
    tip_en: 'Great at end of session to finish chest safely.',
  },
  {
    id: 'chest_press_machine',
    name_fr: 'Chest Press Machine', name_en: 'Chest Press Machine',
    muscle_group: 'chest', muscles: 'Pectoraux, Deltoïdes ant., Triceps',
    type: 'COMPOUND', equipment: 'machine', block: 'chest',
    sets: 3, reps: '10-12', rest: 75, rpe: '7',
    level: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'],
    exec_fr: 'Machine à développé, dos plaqué au dossier, poussée symétrique.',
    exec_en: 'Press machine, back flat against pad, symmetric push.',
    tip_fr: 'Parfait pour débutants et pour finir les pecs en isolation.',
    tip_en: 'Perfect for beginners and finishing chest in isolation.',
  },
  {
    id: 'pec_fly_machine',
    name_fr: 'Pec Fly Machine', name_en: 'Pec Deck Fly',
    muscle_group: 'chest', muscles: 'Pectoraux (isolation)',
    type: 'ISOLATION', equipment: 'machine', block: 'chest',
    sets: 3, reps: '12-15', rest: 60, rpe: '7',
    level: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'],
    exec_fr: 'Assis, bras en croix sur les coussinets, rapprocher les coudes devant soi.',
    exec_en: 'Seated, arms on pads, bring elbows together in front.',
    tip_fr: 'Contraction maximale en fin de mouvement, 1 sec de pause.',
    tip_en: 'Max contraction at end of movement, 1 sec pause.',
  },
  {
    id: 'cable_fly_mid',
    name_fr: 'Écarté poulie milieu', name_en: 'Cable Fly Mid',
    muscle_group: 'chest', muscles: 'Pectoraux (isolation)',
    type: 'ISOLATION', equipment: 'cable', block: 'chest',
    sets: 3, reps: '12-15', rest: 60, rpe: '7',
    level: ['INTERMEDIATE', 'ADVANCED'],
    exec_fr: 'Poulies à hauteur des épaules, croisement des mains devant le sternum.',
    exec_en: 'Cables at shoulder height, cross hands in front of sternum.',
    tip_fr: 'Maintien constant de la tension sur toute l\'amplitude.',
    tip_en: 'Constant tension throughout full range of motion.',
  },
  {
    id: 'cable_fly_low',
    name_fr: 'Écarté poulie basse', name_en: 'Low Cable Fly',
    muscle_group: 'chest', muscles: 'Pectoraux sup.',
    type: 'ISOLATION', equipment: 'cable', block: 'chest',
    sets: 3, reps: '12-15', rest: 60, rpe: '7',
    level: ['INTERMEDIATE', 'ADVANCED'],
    exec_fr: 'Poulies en position basse, lever les bras en arc vers le haut.',
    exec_en: 'Cables in low position, raise arms in arc upward.',
    tip_fr: 'Cible le faisceau supérieur, excellent en finisher pec.',
    tip_en: 'Targets upper chest, excellent as pec finisher.',
  },

  // ════════════════════════════════
  // PUSH — ÉPAULES
  // ════════════════════════════════
  {
    id: 'overhead_press_barbell',
    name_fr: 'Développé militaire barre', name_en: 'Overhead Press',
    muscle_group: 'shoulders', muscles: 'Deltoïdes, Trapèzes, Triceps',
    type: 'COMPOUND', equipment: 'barbell', block: 'shoulders',
    sets: 4, reps: '6-8', rest: 120, rpe: '8',
    level: ['INTERMEDIATE', 'ADVANCED'],
    exec_fr: 'Debout, barre devant le visage, poussée verticale au-dessus de la tête.',
    exec_en: 'Standing, bar in front of face, push vertically overhead.',
    tip_fr: 'Serrer les fessiers et gainage abdominal pendant le mouvement.',
    tip_en: 'Squeeze glutes and brace core throughout movement.',
  },
  {
    id: 'shoulder_press_machine',
    name_fr: 'Shoulder Press Machine', name_en: 'Shoulder Press Machine',
    muscle_group: 'shoulders', muscles: 'Deltoïdes ant. et lat., Triceps',
    type: 'COMPOUND', equipment: 'machine', block: 'shoulders',
    sets: 3, reps: '10-12', rest: 75, rpe: '7',
    level: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'],
    exec_fr: 'Machine à épaules, poussée verticale, coudes légèrement devant.',
    exec_en: 'Shoulder machine, vertical push, elbows slightly forward.',
    tip_fr: 'Contrôle la descente pour préserver les épaules.',
    tip_en: 'Control the descent to protect shoulders.',
  },
  {
    id: 'shoulder_press_dumbbell',
    name_fr: 'Développé épaules haltères', name_en: 'Dumbbell Shoulder Press',
    muscle_group: 'shoulders', muscles: 'Deltoïdes, Trapèzes',
    type: 'COMPOUND', equipment: 'dumbbell', block: 'shoulders',
    sets: 3, reps: '8-12', rest: 90, rpe: '8',
    level: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'],
    exec_fr: 'Assis ou debout, haltères à hauteur d\'oreilles, poussée vers le haut.',
    exec_en: 'Seated or standing, dumbbells at ear height, push upward.',
    tip_fr: 'Ne pas verrouiller les coudes en haut pour maintenir la tension.',
    tip_en: 'Don\'t lock elbows at top to maintain tension.',
  },
  {
    id: 'lateral_raise_dumbbell',
    name_fr: 'Élévation latérale haltères', name_en: 'Dumbbell Lateral Raise',
    muscle_group: 'shoulders', muscles: 'Deltoïdes latéraux',
    type: 'ISOLATION', equipment: 'dumbbell', block: 'shoulders',
    sets: 3, reps: '12-15', rest: 60, rpe: '7',
    level: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'],
    exec_fr: 'Élever les bras sur les côtés jusqu\'à hauteur des épaules, légère flexion coude.',
    exec_en: 'Raise arms to sides to shoulder height, slight elbow bend.',
    tip_fr: 'Incliner légèrement le pouce vers le bas pour mieux cibler le faisceau latéral.',
    tip_en: 'Tilt thumb slightly down to better target lateral head.',
  },
  {
    id: 'lateral_raise_cable',
    name_fr: 'Élévation latérale poulie', name_en: 'Cable Lateral Raise',
    muscle_group: 'shoulders', muscles: 'Deltoïdes latéraux',
    type: 'ISOLATION', equipment: 'cable', block: 'shoulders',
    sets: 3, reps: '12-15', rest: 60, rpe: '7',
    level: ['INTERMEDIATE', 'ADVANCED'],
    exec_fr: 'Poulie basse, élévation unilatérale du bras en croix.',
    exec_en: 'Low cable, unilateral arm raise to side.',
    tip_fr: 'Tension constante contrairement aux haltères.',
    tip_en: 'Constant tension unlike dumbbells.',
  },
  {
    id: 'reverse_pec_fly',
    name_fr: 'Reverse Pec Fly Machine', name_en: 'Reverse Pec Deck',
    muscle_group: 'shoulders', muscles: 'Deltoïdes post., Rhomboïdes',
    type: 'ISOLATION', equipment: 'machine', block: 'shoulders',
    sets: 3, reps: '12-15', rest: 60, rpe: '7',
    level: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'],
    exec_fr: 'Machine pec fly inversée, écartement des bras vers l\'arrière.',
    exec_en: 'Reverse pec deck, arms spread backward.',
    tip_fr: 'Souvent négligé, crucial pour l\'équilibre épaules.',
    tip_en: 'Often neglected, crucial for shoulder balance.',
  },

  // ════════════════════════════════
  // PUSH — TRICEPS
  // ════════════════════════════════
  {
    id: 'skullcrusher',
    name_fr: 'Barre au front (Skullcrusher)', name_en: 'Skullcrusher',
    muscle_group: 'triceps', muscles: 'Triceps (long et latéral)',
    type: 'COMPOUND', equipment: 'barbell', block: 'triceps',
    sets: 3, reps: '8-12', rest: 75, rpe: '8',
    level: ['INTERMEDIATE', 'ADVANCED'],
    exec_fr: 'Allongé, barre au-dessus du front, flexion extension des coudes.',
    exec_en: 'Lying, bar above forehead, flex and extend elbows.',
    tip_fr: 'Garder les coudes fixes et serrés, ne pas les écarter.',
    tip_en: 'Keep elbows fixed and close, don\'t flare them.',
  },
  {
    id: 'triceps_pushdown_cable',
    name_fr: 'Extension triceps poulie haute', name_en: 'Triceps Pushdown',
    muscle_group: 'triceps', muscles: 'Triceps (chef latéral)',
    type: 'ISOLATION', equipment: 'cable', block: 'triceps',
    sets: 3, reps: '10-15', rest: 60, rpe: '7',
    level: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'],
    exec_fr: 'Poulie haute, barre ou corde, extension complète des coudes vers le bas.',
    exec_en: 'High cable, bar or rope, full elbow extension downward.',
    tip_fr: 'Serrer les triceps en bas de mouvement, pause 1 sec.',
    tip_en: 'Squeeze triceps at bottom, 1 sec pause.',
  },
  {
    id: 'triceps_pushdown_low_cable',
    name_fr: 'Triceps poulie basse', name_en: 'Low Cable Triceps Extension',
    muscle_group: 'triceps', muscles: 'Triceps (long)',
    type: 'ISOLATION', equipment: 'cable', block: 'triceps',
    sets: 3, reps: '10-12', rest: 60, rpe: '7',
    level: ['INTERMEDIATE', 'ADVANCED'],
    exec_fr: 'Poulie basse, corde au-dessus de la tête, extension vers l\'avant.',
    exec_en: 'Low cable, rope overhead, extend forward.',
    tip_fr: 'Meilleur étirement du chef long du triceps.',
    tip_en: 'Better stretch of the long triceps head.',
  },
  {
    id: 'triceps_overhead_dumbbell',
    name_fr: 'Extension triceps haltère', name_en: 'Overhead Triceps Extension',
    muscle_group: 'triceps', muscles: 'Triceps (long)',
    type: 'ISOLATION', equipment: 'dumbbell', block: 'triceps',
    sets: 3, reps: '10-12', rest: 60, rpe: '7',
    level: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'],
    exec_fr: 'Haltère tenu des deux mains au-dessus de la tête, flexion des coudes.',
    exec_en: 'Dumbbell held overhead with both hands, bend elbows.',
    tip_fr: 'Garder les coudes proches de la tête tout au long du mouvement.',
    tip_en: 'Keep elbows close to head throughout movement.',
  },
  {
    id: 'dips',
    name_fr: 'Dips', name_en: 'Dips',
    muscle_group: 'triceps', muscles: 'Triceps, Pectoraux inf.',
    type: 'COMPOUND', equipment: 'bodyweight', block: 'triceps',
    sets: 3, reps: '8-12', rest: 90, rpe: '8',
    level: ['INTERMEDIATE', 'ADVANCED'],
    exec_fr: 'Barres parallèles, corps droit, descente jusqu\'à 90° aux coudes, poussée.',
    exec_en: 'Parallel bars, body upright, descend to 90° elbows, push up.',
    tip_fr: 'Corps vertical pour cibler les triceps, penché pour les pecs.',
    tip_en: 'Vertical body for triceps, leaned for chest.',
  },

  // ════════════════════════════════
  // PULL — DOS
  // ════════════════════════════════
  {
    id: 'lat_pulldown_vertical',
    name_fr: 'Tirage vertical machine', name_en: 'Lat Pulldown Machine',
    muscle_group: 'back', muscles: 'Grand dorsal, Biceps',
    type: 'COMPOUND', equipment: 'machine', block: 'back',
    sets: 4, reps: '10-12', rest: 90, rpe: '8',
    level: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'],
    exec_fr: 'Assis, poignée large, tirer vers le sternum en contractant le grand dorsal.',
    exec_en: 'Seated, wide grip, pull to sternum contracting lats.',
    tip_fr: 'Initier le mouvement en déprimant les omoplates, pas avec les bras.',
    tip_en: 'Initiate by depressing shoulder blades, not with arms.',
  },
  {
    id: 'lat_pulldown_v_bar',
    name_fr: 'Tirage vertical prise V', name_en: 'V-Bar Lat Pulldown',
    muscle_group: 'back', muscles: 'Grand dorsal (faisceau inf.), Biceps',
    type: 'COMPOUND', equipment: 'cable', block: 'back',
    sets: 3, reps: '10-12', rest: 90, rpe: '8',
    level: ['INTERMEDIATE', 'ADVANCED'],
    exec_fr: 'Poulie haute, prise V neutre, tirage vers le sternum en serrant les dorsaux.',
    exec_en: 'High cable, neutral V-grip, pull to sternum squeezing lats.',
    tip_fr: 'La prise neutre réduit la sollicitation du biceps.',
    tip_en: 'Neutral grip reduces bicep involvement.',
  },
  {
    id: 'seated_row_machine',
    name_fr: 'Tirage horizontal machine', name_en: 'Seated Row Machine',
    muscle_group: 'back', muscles: 'Dorsaux, Rhomboïdes, Trapèzes moy.',
    type: 'COMPOUND', equipment: 'machine', block: 'back',
    sets: 3, reps: '10-12', rest: 90, rpe: '8',
    level: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'],
    exec_fr: 'Assis à la machine, tirer en rétractant les omoplates, coudes proches du corps.',
    exec_en: 'Seated at machine, pull by retracting scapulas, elbows close to body.',
    tip_fr: 'Finir le mouvement en contractant fort les omoplates ensemble.',
    tip_en: 'Finish movement by squeezing shoulder blades together hard.',
  },
  {
    id: 'cable_row_u_bar',
    name_fr: 'Tirage poulie horizontale prise U', name_en: 'Cable Row U-Bar',
    muscle_group: 'back', muscles: 'Dorsaux, Rhomboïdes, Biceps',
    type: 'COMPOUND', equipment: 'cable', block: 'back',
    sets: 3, reps: '10-12', rest: 90, rpe: '8',
    level: ['INTERMEDIATE', 'ADVANCED'],
    exec_fr: 'Poulie basse, prise en U neutre, tirage vers le nombril.',
    exec_en: 'Low cable, neutral U-grip, pull toward navel.',
    tip_fr: 'Garder le dos droit, ne pas se balancer.',
    tip_en: 'Keep back straight, don\'t swing.',
  },
  {
    id: 'barbell_row',
    name_fr: 'Rowing barre', name_en: 'Barbell Row',
    muscle_group: 'back', muscles: 'Dorsaux, Rhomboïdes, Trapèzes, Biceps',
    type: 'COMPOUND', equipment: 'barbell', block: 'back',
    sets: 4, reps: '8-10', rest: 90, rpe: '8',
    level: ['INTERMEDIATE', 'ADVANCED'],
    exec_fr: 'Penché en avant à 45°, barre tirée vers le nombril, coudes arrière.',
    exec_en: 'Bent over 45°, pull bar to navel, elbows back.',
    tip_fr: 'Dos plat obligatoire, jamais arrondi avec charge lourde.',
    tip_en: 'Flat back mandatory, never rounded with heavy weight.',
  },
  {
    id: 'dumbbell_row',
    name_fr: 'Rowing haltère unilatéral', name_en: 'Single Arm Dumbbell Row',
    muscle_group: 'back', muscles: 'Grand dorsal, Rhomboïdes',
    type: 'COMPOUND', equipment: 'dumbbell', block: 'back',
    sets: 3, reps: '10-12', rest: 75, rpe: '8',
    level: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'],
    exec_fr: 'Appui sur banc, tirer l\'haltère vers la hanche en reculant le coude.',
    exec_en: 'Supported on bench, pull dumbbell toward hip, elbow back.',
    tip_fr: 'Rotation légère du torse pour maximiser l\'amplitude.',
    tip_en: 'Slight torso rotation to maximize range of motion.',
  },
  {
    id: 'pullover_cable',
    name_fr: 'Pull-over poulie corde', name_en: 'Cable Pullover',
    muscle_group: 'back', muscles: 'Grand dorsal (isolation)',
    type: 'ISOLATION', equipment: 'cable', block: 'back',
    sets: 3, reps: '12-15', rest: 60, rpe: '7',
    level: ['INTERMEDIATE', 'ADVANCED'],
    exec_fr: 'Poulie haute, corde, bras tendus, arc vers les hanches.',
    exec_en: 'High cable, rope, arms straight, arc toward hips.',
    tip_fr: 'Excellent pour l\'étirement et la contraction du grand dorsal.',
    tip_en: 'Excellent for stretching and contracting the lats.',
  },
  {
    id: 'rear_delt_cable',
    name_fr: 'Arrière épaule poulie', name_en: 'Rear Delt Cable Fly',
    muscle_group: 'back', muscles: 'Deltoïdes post., Rhomboïdes',
    type: 'ISOLATION', equipment: 'cable', block: 'back',
    sets: 3, reps: '15', rest: 60, rpe: '6',
    level: ['INTERMEDIATE', 'ADVANCED'],
    exec_fr: 'Poulies croisées à hauteur des yeux, écartement vers l\'arrière.',
    exec_en: 'Cross cables at eye level, spread backward.',
    tip_fr: 'Amplitude complète, pas de balancement.',
    tip_en: 'Full range, no swinging.',
  },
  {
    id: 'traps_machine',
    name_fr: 'Trapèze machine', name_en: 'Trap Machine Shrug',
    muscle_group: 'back', muscles: 'Trapèzes',
    type: 'ISOLATION', equipment: 'machine', block: 'back',
    sets: 3, reps: '12-15', rest: 60, rpe: '7',
    level: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'],
    exec_fr: 'Machine à trapèzes ou haussement d\'épaules avec haltères.',
    exec_en: 'Trap machine or dumbbell shrug.',
    tip_fr: 'Montée maximale, maintien 1 sec en haut.',
    tip_en: 'Full elevation, hold 1 sec at top.',
  },
  {
    id: 'pullup',
    name_fr: 'Traction', name_en: 'Pull-up',
    muscle_group: 'back', muscles: 'Grand dorsal, Biceps, Rhomboïdes',
    type: 'COMPOUND', equipment: 'bodyweight', block: 'back',
    sets: 4, reps: '6-10', rest: 120, rpe: '8',
    level: ['INTERMEDIATE', 'ADVANCED'],
    exec_fr: 'Prise pronation large, tirer jusqu\'au menton au-dessus de la barre.',
    exec_en: 'Wide pronated grip, pull until chin above bar.',
    tip_fr: 'Initier avec les dorsaux, pas les biceps.',
    tip_en: 'Initiate with lats, not biceps.',
  },

  // ════════════════════════════════
  // PULL — BICEPS
  // ════════════════════════════════
  {
    id: 'curl_barbell',
    name_fr: 'Curl barre droite', name_en: 'Barbell Curl',
    muscle_group: 'biceps', muscles: 'Biceps, Brachial ant.',
    type: 'COMPOUND', equipment: 'barbell', block: 'biceps',
    sets: 3, reps: '8-12', rest: 75, rpe: '8',
    level: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'],
    exec_fr: 'Debout, barre en pronation, flexion des coudes jusqu\'au sternum.',
    exec_en: 'Standing, supinated bar, curl to sternum.',
    tip_fr: 'Coudes fixes le long du corps, ne pas balancer.',
    tip_en: 'Elbows fixed at sides, don\'t swing.',
  },
  {
    id: 'curl_ez_bar',
    name_fr: 'Curl barre EZ', name_en: 'EZ Bar Curl',
    muscle_group: 'biceps', muscles: 'Biceps, Brachioradial',
    type: 'COMPOUND', equipment: 'barbell', block: 'biceps',
    sets: 3, reps: '8-12', rest: 75, rpe: '8',
    level: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'],
    exec_fr: 'Barre EZ, prise semi-pronation, flexion controlée.',
    exec_en: 'EZ bar, semi-pronated grip, controlled curl.',
    tip_fr: 'Moins de stress sur les poignets qu\'une barre droite.',
    tip_en: 'Less wrist stress than straight bar.',
  },
  {
    id: 'curl_dumbbell_incline',
    name_fr: 'Curl haltères banc incliné', name_en: 'Incline Dumbbell Curl',
    muscle_group: 'biceps', muscles: 'Biceps (chef long)',
    type: 'ISOLATION', equipment: 'dumbbell', block: 'biceps',
    sets: 4, reps: '6-10', rest: 75, rpe: '8',
    level: ['INTERMEDIATE', 'ADVANCED'],
    exec_fr: 'Allongé sur banc incliné à 45°, curl en supination complète.',
    exec_en: 'On incline bench at 45°, curl with full supination.',
    tip_fr: 'Étirement maximal du chef long en position initiale.',
    tip_en: 'Maximum stretch of the long head in start position.',
  },
  {
    id: 'curl_hammer',
    name_fr: 'Curl marteau', name_en: 'Hammer Curl',
    muscle_group: 'biceps', muscles: 'Brachioradial, Biceps',
    type: 'ISOLATION', equipment: 'dumbbell', block: 'biceps',
    sets: 3, reps: '10-12', rest: 60, rpe: '7',
    level: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'],
    exec_fr: 'Prise neutre (pouce vers le haut), flexion jusqu\'à l\'épaule.',
    exec_en: 'Neutral grip (thumb up), curl to shoulder.',
    tip_fr: 'Développe l\'épaisseur du bras (brachial antérieur).',
    tip_en: 'Builds arm thickness (brachialis).',
  },
  {
    id: 'curl_machine',
    name_fr: 'Curl biceps machine', name_en: 'Machine Bicep Curl',
    muscle_group: 'biceps', muscles: 'Biceps',
    type: 'ISOLATION', equipment: 'machine', block: 'biceps',
    sets: 3, reps: '10-12', rest: 60, rpe: '7',
    level: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'],
    exec_fr: 'Machine à biceps, bras calés, flexion complète.',
    exec_en: 'Bicep machine, arms braced, full curl.',
    tip_fr: 'Idéal pour finir les biceps à l\'échec sans risque.',
    tip_en: 'Ideal to finish biceps to failure safely.',
  },
  {
    id: 'curl_preacher',
    name_fr: 'Curl pupitre machine', name_en: 'Preacher Curl Machine',
    muscle_group: 'biceps', muscles: 'Biceps (pic)',
    type: 'ISOLATION', equipment: 'machine', block: 'biceps',
    sets: 3, reps: '10-12', rest: 60, rpe: '7',
    level: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'],
    exec_fr: 'Pupitre machine, bras calés, flexion contrôlée.',
    exec_en: 'Preacher machine, arms braced, controlled curl.',
    tip_fr: 'Isole parfaitement le biceps, excellent pour le pic.',
    tip_en: 'Perfect bicep isolation, great for peak.',
  },

  // ════════════════════════════════
  // LEGS
  // ════════════════════════════════
  {
    id: 'squat_barbell',
    name_fr: 'Squat barre', name_en: 'Barbell Squat',
    muscle_group: 'legs', muscles: 'Quadriceps, Fessiers, Ischio-jambiers',
    type: 'COMPOUND', equipment: 'barbell', block: 'quads',
    sets: 4, reps: '6-8', rest: 180, rpe: '8',
    level: ['INTERMEDIATE', 'ADVANCED'],
    exec_fr: 'Barre sur les trapèzes, descente jusqu\'à parallèle ou en dessous, poussée.',
    exec_en: 'Bar on traps, descend to parallel or below, drive up.',
    tip_fr: 'Genoux dans l\'axe des orteils, dos droit.',
    tip_en: 'Knees tracking toes, back straight.',
  },
  {
    id: 'leg_press',
    name_fr: 'Leg Press', name_en: 'Leg Press',
    muscle_group: 'legs', muscles: 'Quadriceps, Fessiers',
    type: 'COMPOUND', equipment: 'machine', block: 'quads',
    sets: 3, reps: '10-12', rest: 120, rpe: '8',
    level: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'],
    exec_fr: 'Machine à presse, pieds à largeur d\'épaules, descente controlée, poussée.',
    exec_en: 'Press machine, feet shoulder width, controlled descent, push.',
    tip_fr: 'Ne jamais verrouiller les genoux en haut.',
    tip_en: 'Never lock knees at top.',
  },
  {
    id: 'leg_extension',
    name_fr: 'Leg Extension', name_en: 'Leg Extension',
    muscle_group: 'legs', muscles: 'Quadriceps (isolation)',
    type: 'ISOLATION', equipment: 'machine', block: 'quads',
    sets: 3, reps: '12-15', rest: 75, rpe: '7',
    level: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'],
    exec_fr: 'Machine extension jambes, extension complète, contraction en haut.',
    exec_en: 'Leg extension machine, full extension, contract at top.',
    tip_fr: 'Faire 2 séries d\'échauffement avant la charge de travail.',
    tip_en: 'Do 2 warm-up sets before working weight.',
  },
  {
    id: 'leg_curl',
    name_fr: 'Leg Curl', name_en: 'Leg Curl',
    muscle_group: 'legs', muscles: 'Ischio-jambiers',
    type: 'ISOLATION', equipment: 'machine', block: 'hamstrings',
    sets: 4, reps: '10-12', rest: 75, rpe: '7',
    level: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'],
    exec_fr: 'Allongé ou assis, flexion des genoux en tirant les talons vers les fessiers.',
    exec_en: 'Lying or seated, bend knees pulling heels to glutes.',
    tip_fr: 'Descente très lente (3 sec) pour maximiser le travail excentrique.',
    tip_en: 'Very slow descent (3 sec) to maximize eccentric work.',
  },
  {
    id: 'leg_adduction',
    name_fr: 'Adducteurs machine', name_en: 'Leg Adduction Machine',
    muscle_group: 'legs', muscles: 'Adducteurs',
    type: 'ISOLATION', equipment: 'machine', block: 'adductors',
    sets: 4, reps: '12-15', rest: 60, rpe: '7',
    level: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'],
    exec_fr: 'Machine adducteurs, genoux fléchis, rapprochement des cuisses.',
    exec_en: 'Adduction machine, knees bent, bring thighs together.',
    tip_fr: 'Contraction maximale en fin de mouvement.',
    tip_en: 'Maximum contraction at end of movement.',
  },
  {
    id: 'romanian_deadlift',
    name_fr: 'Soulevé de terre roumain', name_en: 'Romanian Deadlift',
    muscle_group: 'legs', muscles: 'Ischio-jambiers, Fessiers, Lombaires',
    type: 'COMPOUND', equipment: 'barbell', block: 'hamstrings',
    sets: 3, reps: '8-12', rest: 90, rpe: '8',
    level: ['INTERMEDIATE', 'ADVANCED'],
    exec_fr: 'Barre en mains, descente le long des jambes en poussant les hanches arrière.',
    exec_en: 'Bar in hands, descend along legs pushing hips back.',
    tip_fr: 'Sentir l\'étirement des ischio-jambiers, dos toujours plat.',
    tip_en: 'Feel hamstring stretch, always flat back.',
  },
  {
    id: 'hip_thrust',
    name_fr: 'Hip Thrust', name_en: 'Hip Thrust',
    muscle_group: 'legs', muscles: 'Fessiers, Ischio-jambiers',
    type: 'COMPOUND', equipment: 'barbell', block: 'glutes',
    sets: 4, reps: '10-12', rest: 90, rpe: '8',
    level: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'],
    exec_fr: 'Épaules sur banc, barre sur les hanches, poussée du bassin vers le haut.',
    exec_en: 'Shoulders on bench, bar on hips, thrust pelvis upward.',
    tip_fr: 'Contraction maximale des fessiers en haut, 1 sec de pause.',
    tip_en: 'Max glute contraction at top, 1 sec pause.',
  },
  {
    id: 'calf_raise_machine',
    name_fr: 'Mollet machine', name_en: 'Calf Raise Machine',
    muscle_group: 'legs', muscles: 'Gastrocnémiens, Soléaire',
    type: 'ISOLATION', equipment: 'machine', block: 'calves',
    sets: 3, reps: '15-20', rest: 60, rpe: '7',
    level: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'],
    exec_fr: 'Machine à mollets, montée sur pointes de pieds, contraction maximale.',
    exec_en: 'Calf machine, rise on toes, maximum contraction.',
    tip_fr: 'Amplitude complète, descente jusqu\'à étirement maximal.',
    tip_en: 'Full range, descend to maximum stretch.',
  },

  // ════════════════════════════════
  // FULL BODY / CORE
  // ════════════════════════════════
  {
    id: 'deadlift',
    name_fr: 'Soulevé de terre', name_en: 'Deadlift',
    muscle_group: 'full', muscles: 'Dorsaux, Fessiers, Ischio, Quadriceps, Trapèzes',
    type: 'COMPOUND', equipment: 'barbell', block: 'full',
    sets: 4, reps: '4-6', rest: 180, rpe: '9',
    level: ['INTERMEDIATE', 'ADVANCED'],
    exec_fr: 'Barre au sol, prise mixte ou double, dos plat, poussée des jambes + traction dos.',
    exec_en: 'Bar on floor, mixed or double grip, flat back, push legs + pull back.',
    tip_fr: 'La barre doit rester collée aux tibias tout au long du mouvement.',
    tip_en: 'Bar must stay close to shins throughout the movement.',
  },
  {
    id: 'abs_cable',
    name_fr: 'Abdos corde poulie', name_en: 'Cable Crunch',
    muscle_group: 'full', muscles: 'Rectus abdominis',
    type: 'ISOLATION', equipment: 'cable', block: 'core',
    sets: 4, reps: '15-20', rest: 60, rpe: '7',
    level: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'],
    exec_fr: 'Poulie haute, corde, agenouillement, flexion du torse vers le sol.',
    exec_en: 'High cable, rope, kneeling, crunch torso toward floor.',
    tip_fr: 'Arrondir le dos pour maximiser la contraction abdominale.',
    tip_en: 'Round the back to maximize abdominal contraction.',
  },

  // ════════════════════════════════
  // BODYWEIGHT
  // ════════════════════════════════
  {
    id: 'pushup',
    name_fr: 'Pompes', name_en: 'Push-ups',
    muscle_group: 'chest', muscles: 'Pectoraux, Triceps, Deltoïdes',
    type: 'COMPOUND', equipment: 'bodyweight', block: 'chest',
    sets: 3, reps: '12-20', rest: 60, rpe: '7',
    level: ['BEGINNER', 'INTERMEDIATE'],
    exec_fr: 'Mains à largeur d\'épaules, corps droit, descente controlée, poussée.',
    exec_en: 'Hands shoulder width, body straight, controlled descent, push.',
    tip_fr: 'Serrer les abdos et les fessiers pendant tout le mouvement.',
    tip_en: 'Squeeze abs and glutes throughout movement.',
  },
  {
    id: 'chin_up_bw',
    name_fr: 'Traction supination', name_en: 'Chin-up',
    muscle_group: 'back', muscles: 'Grand dorsal, Biceps',
    type: 'COMPOUND', equipment: 'bodyweight', block: 'back',
    sets: 4, reps: '6-10', rest: 120, rpe: '8',
    level: ['INTERMEDIATE', 'ADVANCED'],
    exec_fr: 'Prise supination, tirer jusqu\'au menton au-dessus de la barre.',
    exec_en: 'Supinated grip, pull until chin above bar.',
    tip_fr: 'Plus de biceps que la traction pronation.',
    tip_en: 'More bicep involvement than pronated pull-up.',
  },
  {
    id: 'glute_bridge_bw',
    name_fr: 'Pont fessier', name_en: 'Glute Bridge',
    muscle_group: 'legs', muscles: 'Fessiers, Ischio-jambiers',
    type: 'COMPOUND', equipment: 'bodyweight', block: 'glutes',
    sets: 3, reps: '15-20', rest: 60, rpe: '6',
    level: ['BEGINNER'],
    exec_fr: 'Allongé sur le dos, pousser les hanches vers le haut en contractant les fessiers.',
    exec_en: 'Lying on back, push hips upward contracting glutes.',
    tip_fr: 'Variante débutant du Hip Thrust.',
    tip_en: 'Beginner variant of Hip Thrust.',
  },
]

// ─── BLOCS PAR TYPE DE SÉANCE ─────────────────────────────
const SESSION_BLOCKS = {
  PUSH: [
    { name: 'chest',     label_fr: 'Pectoraux',  label_en: 'Chest',    primary: true  },
    { name: 'shoulders', label_fr: 'Épaules',    label_en: 'Shoulders',primary: false },
    { name: 'triceps',   label_fr: 'Triceps',    label_en: 'Triceps',  primary: false },
  ],
  PULL: [
    { name: 'back',      label_fr: 'Dos',        label_en: 'Back',     primary: true  },
    { name: 'biceps',    label_fr: 'Biceps',     label_en: 'Biceps',   primary: false },
  ],
  LEGS: [
    { name: 'quads',     label_fr: 'Quadriceps', label_en: 'Quads',    primary: true  },
    { name: 'hamstrings',label_fr: 'Ischio',     label_en: 'Hamstrings',primary: false },
    { name: 'glutes',    label_fr: 'Fessiers',   label_en: 'Glutes',   primary: false },
    { name: 'calves',    label_fr: 'Mollets',    label_en: 'Calves',   primary: false },
    { name: 'adductors', label_fr: 'Adducteurs', label_en: 'Adductors',primary: false },
  ],
  FULL: [
    { name: 'chest',     label_fr: 'Pectoraux',  label_en: 'Chest',    primary: true  },
    { name: 'back',      label_fr: 'Dos',        label_en: 'Back',     primary: true  },
    { name: 'shoulders', label_fr: 'Épaules',    label_en: 'Shoulders',primary: false },
    { name: 'legs',      label_fr: 'Jambes',     label_en: 'Legs',     primary: false },
  ],
}

// ─── WARMUP ──────────────────────────────────────────────
const WARMUP = {
  fr: [
    { name: '5 min vélo ou rameur léger',       duration: '5 min' },
    { name: 'Rotations épaules & poignets',     duration: '1 min' },
    { name: 'Échauffement articulaire general', duration: '2 min' },
    { name: 'Séries légères sur 1er exercice',  duration: '2×15 reps @ 50%' },
  ],
  en: [
    { name: '5 min light bike or rower',        duration: '5 min' },
    { name: 'Shoulder & wrist rotations',       duration: '1 min' },
    { name: 'General joint warm-up',            duration: '2 min' },
    { name: 'Light sets on first exercise',     duration: '2×15 reps @ 50%' },
  ],
}

// ─── STRETCHES ───────────────────────────────────────────
const STRETCHES_FR = {
  chest:    [{ name: 'Étirement pec à la porte', duration: '60s/côté' }, { name: 'Cross arm stretch', duration: '45s/côté' }],
  shoulders:[{ name: 'Étirement épaule bras croisé', duration: '45s/côté' }, { name: 'Étirement overhead triceps', duration: '45s/côté' }],
  triceps:  [{ name: 'Étirement overhead triceps', duration: '45s/côté' }],
  back:     [{ name: 'Posture de l\'enfant', duration: '90s' }, { name: 'Chat-vache', duration: '10 reps lentes' }],
  biceps:   [{ name: 'Étirement biceps mur', duration: '45s/côté' }],
  legs:     [{ name: 'Fente avant statique', duration: '60s/côté' }, { name: 'Pigeon yoga', duration: '90s/côté' }],
  quads:    [{ name: 'Étirement quadriceps debout', duration: '45s/côté' }],
  hamstrings:[{ name: 'Toucher orteils assis', duration: '60s' }, { name: 'Fente arrière', duration: '45s/côté' }],
  glutes:   [{ name: 'Figure 4 allongée', duration: '60s/côté' }],
  calves:   [{ name: 'Étirement mollet mur', duration: '45s/côté' }],
}

const STRETCHES_EN = {
  chest:    [{ name: 'Doorway pec stretch', duration: '60s/side' }, { name: 'Cross arm stretch', duration: '45s/side' }],
  shoulders:[{ name: 'Cross body shoulder stretch', duration: '45s/side' }],
  triceps:  [{ name: 'Overhead triceps stretch', duration: '45s/side' }],
  back:     [{ name: 'Child\'s pose', duration: '90s' }, { name: 'Cat-cow', duration: '10 slow reps' }],
  biceps:   [{ name: 'Wall bicep stretch', duration: '45s/side' }],
  legs:     [{ name: 'Static forward lunge', duration: '60s/side' }, { name: 'Pigeon pose', duration: '90s/side' }],
  quads:    [{ name: 'Standing quad stretch', duration: '45s/side' }],
  hamstrings:[{ name: 'Seated toe touch', duration: '60s' }],
  glutes:   [{ name: 'Figure 4 stretch', duration: '60s/side' }],
  calves:   [{ name: 'Wall calf stretch', duration: '45s/side' }],
}

// ─── UTILITAIRES ─────────────────────────────────────────
const shuffle = (arr) => {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const filterByEquipment = (exercises, equipment = []) => {
  if (!equipment || equipment.length === 0) return exercises
  return exercises.filter(ex =>
    ex.equipment === 'bodyweight' ||
    equipment.some(eq => {
      if (eq === 'eqBar')   return ex.equipment === 'barbell'
      if (eq === 'eqDb')    return ex.equipment === 'dumbbell'
      if (eq === 'eqCbl')   return ex.equipment === 'cable'
      if (eq === 'eqMch')   return ex.equipment === 'machine'
      if (eq === 'eqPull')  return ex.equipment === 'bodyweight'
      if (eq === 'eqBand')  return ex.equipment === 'band'
      if (eq === 'eqKb')    return ex.equipment === 'kettlebell'
      if (eq === 'eqBench') return true
      if (eq === 'eqBW')    return ex.equipment === 'bodyweight'
      return false
    })
  )
}

const filterByLevel = (exercises, level) => {
  if (!level) return exercises
  return exercises.filter(ex => ex.level.includes(level))
}

const pickFromBlock = (block, exercises, count, level, equipment, hasGym) => {
  let pool = exercises.filter(ex => ex.block === block)
  if (!hasGym) pool = filterByEquipment(pool, equipment)
  pool = filterByLevel(pool, level)
  pool = shuffle(pool)
  return pool.slice(0, count)
}

// ─── RÉPARTITION DES EXERCICES PAR BLOC ──────────────────
const distributeExCount = (focus, totalEx) => {
  switch (focus) {
    case 'PUSH':
      if (totalEx <= 4) return { chest: 2, shoulders: 1, triceps: 1 }
      if (totalEx === 5) return { chest: 2, shoulders: 2, triceps: 1 }
      if (totalEx === 6) return { chest: 3, shoulders: 2, triceps: 2 } // ← 2 blocs de 3
      if (totalEx === 7) return { chest: 3, shoulders: 2, triceps: 2 }
      if (totalEx === 8) return { chest: 3, shoulders: 3, triceps: 2 }
      return { chest: 3, shoulders: 3, triceps: 3 }

    case 'PULL':
      if (totalEx <= 4) return { back: 3, biceps: 1 }
      if (totalEx === 5) return { back: 3, biceps: 2 }
      if (totalEx === 6) return { back: 4, biceps: 2 } // ← 2 blocs
      if (totalEx === 7) return { back: 4, biceps: 3 }
      if (totalEx === 8) return { back: 5, biceps: 3 }
      return { back: 5, biceps: 4 }

    case 'LEGS':
      if (totalEx <= 4) return { quads: 2, hamstrings: 1, glutes: 1 }
      if (totalEx === 5) return { quads: 2, hamstrings: 2, glutes: 1 }
      if (totalEx === 6) return { quads: 2, hamstrings: 2, glutes: 1, calves: 1 }
      if (totalEx === 7) return { quads: 2, hamstrings: 2, glutes: 1, calves: 1, adductors: 1 }
      if (totalEx === 8) return { quads: 3, hamstrings: 2, glutes: 1, calves: 1, adductors: 1 }
      return { quads: 3, hamstrings: 2, glutes: 2, calves: 1, adductors: 1 }

    case 'FULL':
      if (totalEx <= 4) return { chest: 1, back: 1, shoulders: 1, legs: 1 }
      if (totalEx === 5) return { chest: 1, back: 2, shoulders: 1, legs: 1 }
      if (totalEx === 6) return { chest: 2, back: 2, shoulders: 1, legs: 1 }
      if (totalEx === 7) return { chest: 2, back: 2, shoulders: 1, legs: 2 }
      if (totalEx === 8) return { chest: 2, back: 2, shoulders: 2, legs: 2 }
      return { chest: 2, back: 3, shoulders: 2, legs: 2 }

    default:
      return { chest: 2, back: 2, shoulders: 1, legs: 1 }
  }
}

// ─── GÉNÉRATION PRINCIPALE ───────────────────────────────
export const generateWorkout = async ({
  profile,
  focus: focusOverride,
  lang = 'fr',
  duration = 60,
  wantWarmup = true,
  wantFinisher = false,
  wantStretches = true,
  lastWeights = {},
}) => {
  const level    = profile?.level || 'INTERMEDIATE'
  const freq     = profile?.freq  || 4
  const hasGym   = profile?.has_gym ?? true
  const equipment= profile?.equipment || []

  const split  = getSplit(freq)
  const focus  = focusOverride || split[0]
  const totalEx = durationToExCount(duration)
  const sets   = durationToSets(duration)

  const dist = distributeExCount(focus, totalEx)

  // Construire la liste d'exercices par bloc
  let mainExercises = []

  Object.entries(dist).forEach(([block, count]) => {
    const picked = pickFromBlock(block, EXERCISES, count, level, equipment, hasGym)
    mainExercises = [...mainExercises, ...picked]
  })

  // Formater les exercices
  const formatted = mainExercises.map((ex, idx) => {
    const lastW = lastWeights[ex.id]
    return {
      ...ex,
      order: idx + 1,
      sets: sets,
      display_name:  lang === 'fr' ? ex.name_fr  : ex.name_en,
      display_muscle: ex.muscles,
      display_equip: ex.equipment,
      display_fiber: ex.muscles,
      display_exec:  lang === 'fr' ? ex.exec_fr  : ex.exec_en,
      display_tip:   lang === 'fr' ? ex.tip_fr   : ex.tip_en,
      weight_log:    lastW ? lastW.weight : null,
      last_weight:   lastW ? lastW.weight : null,
      last_reps:     lastW ? lastW.reps   : null,
    }
  })

  // Warmup
  const warmup = wantWarmup ? WARMUP[lang] : []

  // Stretches ciblés
  let cooldown = []
  if (wantStretches) {
    const stretches = lang === 'fr' ? STRETCHES_FR : STRETCHES_EN
    const blocksUsed = [...new Set(mainExercises.map(ex => ex.block))]
    const muscleMap = { chest: 'chest', shoulders: 'shoulders', triceps: 'triceps', back: 'back', biceps: 'biceps', quads: 'quads', hamstrings: 'hamstrings', glutes: 'glutes', calves: 'calves', adductors: 'legs' }
    const seen = new Set()
    blocksUsed.forEach(block => {
      const key = muscleMap[block]
      if (key && stretches[key]) {
        stretches[key].forEach(s => {
          if (!seen.has(s.name)) {
            seen.add(s.name)
            cooldown.push(s)
          }
        })
      }
    })
    cooldown = cooldown.slice(0, 5)
  }

  // Finisher
  const finisher = wantFinisher ? {
    name: lang === 'fr' ? 'Finisher Cardio' : 'Cardio Finisher',
    exercises: lang === 'fr'
      ? ['30 Burpees', '20 Jumping Jacks', '15 Mountain Climbers (×2)']
      : ['30 Burpees', '20 Jumping Jacks', '15 Mountain Climbers (×2)'],
  } : null

  return {
    focus,
    goal:              profile?.goal,
    level,
    gymId:             profile?.gym_id,
    exerciseCount:     formatted.length,
    totalSets:         formatted.reduce((acc, ex) => acc + (ex.sets || 3), 0),
    estimatedDuration: duration,
    main:              formatted,
    warmup,
    cooldown,
    finisher,
  }
}

export { getSplit, durationToExCount }
