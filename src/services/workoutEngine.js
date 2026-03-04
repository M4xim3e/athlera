// src/services/workoutEngine.js
import { EXERCISES } from '../data/exercises'
import { WARMUPS, COOLDOWNS } from '../data/warmups'
import { getGymEquipment } from '../data/gyms'

const SCHEMES = {
  MUSCLE_GAIN: {
    BEGINNER:     { sets:3, reps:'10–12', rest:75,  rpe:7, tempo:'3-0-1-0' },
    INTERMEDIATE: { sets:4, reps:'8–12',  rest:90,  rpe:8, tempo:'3-0-1-0' },
    ADVANCED:     { sets:5, reps:'6–10',  rest:120, rpe:9, tempo:'3-1-1-0' },
  },
  STRENGTH: {
    BEGINNER:     { sets:3, reps:'6–8',  rest:150, rpe:7, tempo:'2-0-1-0' },
    INTERMEDIATE: { sets:4, reps:'4–6',  rest:180, rpe:8, tempo:'2-1-1-0' },
    ADVANCED:     { sets:5, reps:'2–5',  rest:240, rpe:9, tempo:'2-1-X-0' },
  },
  FAT_LOSS: {
    BEGINNER:     { sets:3, reps:'15',    rest:45,  rpe:7, tempo:'2-0-1-0' },
    INTERMEDIATE: { sets:4, reps:'12–15', rest:30,  rpe:8, tempo:'2-0-1-0' },
    ADVANCED:     { sets:4, reps:'15–20', rest:20,  rpe:9, tempo:'1-0-1-0' },
  },
  MAINTENANCE: {
    BEGINNER:     { sets:3, reps:'12',    rest:60,  rpe:6, tempo:'2-0-1-0' },
    INTERMEDIATE: { sets:3, reps:'10–12', rest:60,  rpe:7, tempo:'2-0-1-0' },
    ADVANCED:     { sets:3, reps:'10–12', rest:60,  rpe:7, tempo:'2-0-1-0' },
  },
  PERFORMANCE: {
    BEGINNER:     { sets:3, reps:'10',   rest:90,  rpe:7, tempo:'2-0-X-0' },
    INTERMEDIATE: { sets:4, reps:'8–10', rest:90,  rpe:8, tempo:'2-0-X-0' },
    ADVANCED:     { sets:5, reps:'6–8',  rest:120, rpe:9, tempo:'1-0-X-0' },
  },
}

const FOCUS_MAP = {
  PUSH:  ['PUSH'],
  PULL:  ['PULL'],
  LEGS:  ['LEGS'],
  FULL:  ['PUSH','PULL','LEGS','FULL'],
  UPPER: ['PUSH','PULL'],
  LOWER: ['LEGS'],
}

// Exercices domicile enrichis
const HOME_EXERCISES = [
  {
    id: 'pushup',
    focus:'PUSH', type:'COMPOUND', muscle_group:'chest',
    difficulty:['BEGINNER','INTERMEDIATE'],
    equipment:'bodyweight',
    name:   { fr:'Pompes', en:'Push-Up' },
    muscle: { fr:'Pectoraux · Triceps · Épaules', en:'Chest · Triceps · Shoulders' },
    fiber:  { fr:'Grand pectoral, deltoïde antérieur, triceps. Variez la largeur des mains pour cibler différentes zones.', en:'Pec major, anterior deltoid, triceps. Vary hand width to target different zones.' },
    equip:  { fr:'Poids du corps', en:'Bodyweight' },
    exec:   { fr:'Corps rigide · descente 3s · poitrine au sol · extension explosive', en:'Rigid body · 3s descent · chest to floor · explosive push' },
    tip:    { fr:'Gainage total. Omoplates rétractées en haut. Pieds rapprochés = plus de triceps, écartés = plus de pectoraux.', en:'Total tension. Scapulae retracted at top. Feet together = more triceps, wide = more chest.' },
    sets_range:[3,4], reps_range:[10,20], rest:60,
    muscles_primary:['chest_mid'], muscles_secondary:['delt_ant','triceps_all'],
  },
  {
    id: 'diamond_pushup',
    focus:'PUSH', type:'ISOLATION', muscle_group:'triceps',
    difficulty:['INTERMEDIATE','ADVANCED'],
    equipment:'bodyweight',
    name:   { fr:'Pompes diamant', en:'Diamond Push-Up' },
    muscle: { fr:'Triceps · Pectoraux internes', en:'Triceps · Inner Chest' },
    fiber:  { fr:'Chef médial et long du triceps. Pectoraux internes. Positionnez les mains en triangle sous la poitrine.', en:'Medial and long tricep heads. Inner pec. Position hands in triangle under chest.' },
    equip:  { fr:'Poids du corps', en:'Bodyweight' },
    exec:   { fr:'Mains en triangle · coudes contre le corps · extension complète', en:'Hands in triangle · elbows against body · full extension' },
    tip:    { fr:'Mains en triangle sous le sternum. Coudes contre le corps lors de la descente.', en:'Hands in triangle under sternum. Elbows stay against body on the way down.' },
    sets_range:[3,4], reps_range:[8,15], rest:60,
    muscles_primary:['triceps_long','triceps_lat'], muscles_secondary:['chest_mid'],
  },
  {
    id: 'pike_pushup',
    focus:'PUSH', type:'COMPOUND', muscle_group:'shoulders',
    difficulty:['BEGINNER','INTERMEDIATE'],
    equipment:'bodyweight',
    name:   { fr:'Pompe piqué (épaules)', en:'Pike Push-Up' },
    muscle: { fr:'Deltoïdes · Trapèzes', en:'Deltoids · Traps' },
    fiber:  { fr:'Deltoïde antérieur et médial. Corps en V inversé, hanches hautes, descente de la tête vers le sol.', en:'Anterior and medial deltoid. Body in inverted V, hips high, head drops toward floor.' },
    equip:  { fr:'Poids du corps', en:'Bodyweight' },
    exec:   { fr:'Hanches en V · tête vers le sol · extension complète bras', en:'Hips in V · head toward floor · full arm extension' },
    tip:    { fr:'Plus les hanches sont hautes, plus l\'angle ressemble à un développé militaire.', en:'Higher hips = more overhead press angle.' },
    sets_range:[3,4], reps_range:[8,15], rest:60,
    muscles_primary:['delt_ant','delt_lat'], muscles_secondary:['traps_upper'],
  },
  {
    id: 'bodyweight_row',
    focus:'PULL', type:'COMPOUND', muscle_group:'back',
    difficulty:['BEGINNER','INTERMEDIATE'],
    equipment:'bodyweight',
    name:   { fr:'Rowing australien', en:'Australian Row / Bodyweight Row' },
    muscle: { fr:'Grand dorsal · Rhomboïdes · Biceps', en:'Lats · Rhomboids · Biceps' },
    fiber:  { fr:'Grand dorsal, rhomboïdes, trapèzes moyens, biceps. Nécessite une barre basse ou table solide.', en:'Lats, rhomboids, mid traps, biceps. Requires a low bar or sturdy table.' },
    equip:  { fr:'Barre basse / Table solide', en:'Low bar / Sturdy table' },
    exec:   { fr:'Corps rigide · tirez la poitrine vers la barre · excentrique contrôlé', en:'Rigid body · pull chest to bar · controlled eccentric' },
    tip:    { fr:'Plus le corps est horizontal, plus c\'est difficile. Abaissez les pieds pour progresser.', en:'More horizontal = harder. Raise feet to progress.' },
    sets_range:[3,4], reps_range:[8,15], rest:60,
    muscles_primary:['lats_mid','rhomboids'], muscles_secondary:['biceps_long'],
  },
  {
    id: 'chin_up_bw',
    focus:'PULL', type:'COMPOUND', muscle_group:'back',
    difficulty:['INTERMEDIATE','ADVANCED'],
    equipment:'bodyweight',
    name:   { fr:'Traction supination', en:'Chin-Up' },
    muscle: { fr:'Grand dorsal · Biceps', en:'Lats · Biceps' },
    fiber:  { fr:'Grand dorsal, grand rond, biceps brachial (très actif en supination). Plus de biceps que la pronation.', en:'Lats, teres major, biceps (very active in supination). More biceps than pull-up.' },
    equip:  { fr:'Barre de traction', en:'Pull-up Bar' },
    exec:   { fr:'Prise supination · suspension complète · poitrine vers la barre', en:'Supinated grip · dead hang · chest to bar' },
    tip:    { fr:'La supination active davantage le biceps que la traction pronation classique.', en:'Supinated grip activates biceps more than regular pull-up.' },
    sets_range:[3,5], reps_range:[4,12], rest:120,
    muscles_primary:['lats_upper','biceps_long'], muscles_secondary:['lats_mid'],
  },
  {
    id: 'bw_squat_jump',
    focus:'LEGS', type:'COMPOUND', muscle_group:'quads',
    difficulty:['BEGINNER','INTERMEDIATE'],
    equipment:'bodyweight',
    name:   { fr:'Squat sauté', en:'Jump Squat' },
    muscle: { fr:'Quadriceps · Fessiers · Mollets', en:'Quads · Glutes · Calves' },
    fiber:  { fr:'Tous les extenseurs de la jambe en puissance explosive. Excellent pour la force athlétique.', en:'All leg extensors in explosive power. Great for athletic strength.' },
    equip:  { fr:'Poids du corps', en:'Bodyweight' },
    exec:   { fr:'Squat profond · explosion maximale · réception souple', en:'Deep squat · maximum explosion · soft landing' },
    tip:    { fr:'Réception souple, amorti avec les genoux. Atterrissez en silence.', en:'Soft landing, absorb with knees. Land silently.' },
    sets_range:[3,4], reps_range:[10,15], rest:60,
    muscles_primary:['quads_rect','glute_max'], muscles_secondary:['gastro_lat'],
  },
  {
    id: 'nordic_curl',
    focus:'LEGS', type:'COMPOUND', muscle_group:'hamstrings',
    difficulty:['ADVANCED'],
    equipment:'bodyweight',
    name:   { fr:'Curl nordique', en:'Nordic Curl' },
    muscle: { fr:'Ischio-jambiers — Excentrique intense', en:'Hamstrings — Intense Eccentric' },
    fiber:  { fr:'Biceps fémoral en contraction excentrique maximale. L\'exercice le plus efficace pour les ischio-jambiers au poids du corps.', en:'Biceps femoris in maximum eccentric contraction. Most effective bodyweight hamstring exercise.' },
    equip:  { fr:'Partenaire ou meuble fixe pour les chevilles', en:'Partner or fixed furniture for ankles' },
    exec:   { fr:'Chevilles fixées · descente excentrique contrôlée · pompe pour remonter si nécessaire', en:'Ankles fixed · controlled eccentric descent · push up if needed' },
    tip:    { fr:'Descendez aussi lentement que possible. Progressez sur l\'excentrique avant l\'amplitude complète.', en:'Descend as slowly as possible. Build the eccentric before full range.' },
    sets_range:[3,4], reps_range:[4,10], rest:120,
    muscles_primary:['hamstring_bicep','hamstring_semis'], muscles_secondary:[],
  },
  {
    id: 'glute_bridge_bw',
    focus:'LEGS', type:'COMPOUND', muscle_group:'glutes',
    difficulty:['BEGINNER','INTERMEDIATE','ADVANCED'],
    equipment:'bodyweight',
    name:   { fr:'Pont fessier / Hip Thrust poids du corps', en:'Glute Bridge / Bodyweight Hip Thrust' },
    muscle: { fr:'Fessiers · Ischio-jambiers', en:'Glutes · Hamstrings' },
    fiber:  { fr:'Grand fessier en contraction maximale. Ajoutez un élastique sur les genoux pour plus d\'intensité.', en:'Gluteus maximus at maximum contraction. Add a band at knees for more intensity.' },
    equip:  { fr:'Poids du corps (élastique optionnel)', en:'Bodyweight (band optional)' },
    exec:   { fr:'Pieds à plat · bascule pelvienne en haut · contraction 2s · menton rentré', en:'Flat feet · pelvic tilt at top · 2s squeeze · chin tucked' },
    tip:    { fr:'Pause 2s au sommet, bascule pelvienne. Version unilatérale pour plus d\'intensité.', en:'2s pause at top with pelvic tilt. Single leg for more intensity.' },
    sets_range:[3,4], reps_range:[15,25], rest:45,
    muscles_primary:['glute_max','glute_med'], muscles_secondary:['hamstring_bicep'],
  },
  {
    id: 'kb_swing',
    focus:'FULL', type:'COMPOUND', muscle_group:'glutes',
    difficulty:['INTERMEDIATE','ADVANCED'],
    equipment:'dumbbell',
    name:   { fr:'Swing Kettlebell / Haltère', en:'Kettlebell / Dumbbell Swing' },
    muscle: { fr:'Fessiers · Ischio-jambiers · Dos', en:'Glutes · Hamstrings · Back' },
    fiber:  { fr:'Grand fessier, ischio-jambiers, érecteurs, trapèzes. Mouvement balistique complet.', en:'Glute max, hamstrings, erectors, traps. Full ballistic movement.' },
    equip:  { fr:'Kettlebell ou Haltère', en:'Kettlebell or Dumbbell' },
    exec:   { fr:'Charnière hanche · projection explosive · bras comme une corde · frein en haut', en:'Hip hinge · explosive drive · arms like a rope · brake at top' },
    tip:    { fr:'Ce n\'est pas un squat — c\'est une charnière de hanche. Les fessiers propulsent, pas les bras.', en:'It\'s a hinge not a squat. Glutes propel, arms are just a rope.' },
    sets_range:[3,4], reps_range:[12,20], rest:60,
    muscles_primary:['glute_max','hamstring_bicep'], muscles_secondary:['erectors','traps_upper'],
  },
  {
    id: 'band_pull_apart',
    focus:'PULL', type:'ISOLATION', muscle_group:'shoulders',
    difficulty:['BEGINNER','INTERMEDIATE','ADVANCED'],
    equipment:'bodyweight',
    name:   { fr:'Écart élastique (face pull)', en:'Band Pull-Apart' },
    muscle: { fr:'Deltoïdes post. · Rhomboïdes · Coiffe', en:'Rear Delts · Rhomboids · Rotator Cuff' },
    fiber:  { fr:'Deltoïde postérieur, rhomboïdes, trapèzes moyens. Santé des épaules et posture.', en:'Posterior deltoid, rhomboids, mid traps. Shoulder health and posture.' },
    equip:  { fr:'Élastique (optionnel)', en:'Band (optional)' },
    exec:   { fr:'Bras tendus · écartez jusqu\'aux épaules · contraction 1s · retour contrôlé', en:'Arms extended · pull to shoulder width · 1s squeeze · controlled return' },
    tip:    { fr:'Pouce vers le haut en tirant pour maximiser la rotation externe. Peut se faire sans élastique.', en:'Thumbs up while pulling for max external rotation. Can be done without band.' },
    sets_range:[3,4], reps_range:[15,25], rest:30,
    muscles_primary:['delt_post','rhomboids'], muscles_secondary:['traps_mid'],
  },
]

// Étirements ciblés par groupe musculaire
const STRETCHES = {
  chest: {
    fr: [
      { name:'Étirement pecto porte',   duration:'60s/côté', instruction:'Bras à 90° sur le cadre de porte. Inclinez doucement le buste vers l\'avant jusqu\'à sentir l\'étirement.' },
      { name:'Étirement pecto bras haut',duration:'45s/côté',instruction:'Bras tendu à 135° sur un mur. Faites pivoter doucement le corps à l\'opposé.' },
    ],
    en: [
      { name:'Doorway Chest Stretch',   duration:'60s/side', instruction:'Arm at 90° on door frame. Gently lean forward until you feel the stretch.' },
      { name:'High Arm Chest Stretch',  duration:'45s/side', instruction:'Arm straight at 135° on wall. Gently rotate body away.' },
    ],
  },
  shoulders: {
    fr: [
      { name:'Étirement cross-body',    duration:'45s/côté', instruction:'Bras croisé devant la poitrine. Épaule abaissée. L\'autre main tire doucement.' },
      { name:'Étirement épaule bras haut',duration:'40s/côté',instruction:'Coude plié derrière la tête. Tirez doucement avec l\'autre main.' },
    ],
    en: [
      { name:'Cross-Body Shoulder',     duration:'45s/side', instruction:'Arm across chest. Shoulder depressed. Other hand pulls gently.' },
      { name:'Overhead Shoulder',       duration:'40s/side', instruction:'Elbow bent behind head. Gently pull with other hand.' },
    ],
  },
  triceps: {
    fr: [
      { name:'Étirement triceps',       duration:'40s/côté', instruction:'Coude derrière la tête. Aidez avec l\'autre main. Maintenez sans douleur.' },
    ],
    en: [
      { name:'Tricep Overhead Stretch', duration:'40s/side', instruction:'Elbow behind head. Assist with other hand. Hold without pain.' },
    ],
  },
  back: {
    fr: [
      { name:'Posture de l\'enfant',    duration:'90s', instruction:'Bras tendus devant. Respirez profondément. Décompression vertébrale complète.' },
      { name:'Chat-vache lent',         duration:'10 répétitions lentes', instruction:'Mobilisez chaque vertèbre. Expirez en arrondissant, inspirez en creusant.' },
      { name:'Suspension à la barre',   duration:'2×30s', instruction:'Suspension complète. Laissez la gravité décompresser la colonne.' },
    ],
    en: [
      { name:'Child\'s Pose',           duration:'90s', instruction:'Arms extended forward. Deep breathing. Full spinal decompression.' },
      { name:'Slow Cat-Cow',            duration:'10 slow reps', instruction:'Mobilise each vertebra. Exhale rounding, inhale arching.' },
      { name:'Dead Hang',               duration:'2×30s', instruction:'Full hang. Let gravity decompress the spine.' },
    ],
  },
  biceps: {
    fr: [
      { name:'Étirement biceps mur',    duration:'30s/côté', instruction:'Paume sur le mur, doigts vers le bas. Pivotez doucement le corps à l\'opposé.' },
    ],
    en: [
      { name:'Bicep Wall Stretch',      duration:'30s/side', instruction:'Palm on wall fingers down. Gently rotate body away.' },
    ],
  },
  quads: {
    fr: [
      { name:'Étirement quadriceps debout', duration:'45s/côté', instruction:'Talon vers le fessier. Genou pointé vers le bas. Tenez un mur si besoin.' },
      { name:'Fente basse étirement',      duration:'60s/côté', instruction:'Genou arrière au sol. Poussez les hanches vers l\'avant et le bas.' },
    ],
    en: [
      { name:'Standing Quad Stretch',   duration:'45s/side', instruction:'Heel to glute. Knee pointing down. Hold wall if needed.' },
      { name:'Low Lunge Stretch',       duration:'60s/side', instruction:'Rear knee on floor. Push hips forward and down.' },
    ],
  },
  hamstrings: {
    fr: [
      { name:'Ischio assis jambe tendue',  duration:'60s/côté', instruction:'Inclinez depuis la hanche, dos droit. Jambe tendue, pied fléchi vers vous.' },
      { name:'Position couchée jambe levée',duration:'45s/côté',instruction:'Allongé. Amenez une jambe tendue vers vous. Respirez dans l\'étirement.' },
    ],
    en: [
      { name:'Seated Hamstring Stretch', duration:'60s/side', instruction:'Hinge from hip, flat back. Leg extended, foot flexed toward you.' },
      { name:'Supine Leg Raise Stretch', duration:'45s/side', instruction:'Lying down. Bring straight leg toward you. Breathe into the stretch.' },
    ],
  },
  glutes: {
    fr: [
      { name:'Pigeon yoga',             duration:'90s/côté', instruction:'Jambe avant pliée à 90°. Hanches carrées vers le sol. Respirez profondément.' },
      { name:'Figure 4 allongée',       duration:'60s/côté', instruction:'Allongé. Cheville sur le genou opposé. Ramenez les deux jambes vers vous.' },
    ],
    en: [
      { name:'Pigeon Pose',             duration:'90s/side', instruction:'Front leg bent at 90°. Hips square to floor. Breathe deeply.' },
      { name:'Figure 4 Stretch',        duration:'60s/side', instruction:'Lying down. Ankle on opposite knee. Pull both legs toward you.' },
    ],
  },
  calves: {
    fr: [
      { name:'Étirement mollets mur',   duration:'60s/côté', instruction:'Pied contre un mur, talon au sol. Penchez-vous vers le mur. Genou tendu puis fléchi.' },
    ],
    en: [
      { name:'Wall Calf Stretch',       duration:'60s/side', instruction:'Foot against wall, heel down. Lean into wall. Straight then bent knee.' },
    ],
  },
  core: {
    fr: [
      { name:'Cobra yoga',              duration:'60s', instruction:'Allongé sur le ventre. Mains sous les épaules. Poussez la poitrine vers le haut.' },
      { name:'Torsion dorsale allongée',duration:'45s/côté', instruction:'Allongé. Genoux d\'un côté. Épaules au sol. Regardez à l\'opposé des genoux.' },
    ],
    en: [
      { name:'Cobra Pose',              duration:'60s', instruction:'Lying face down. Hands under shoulders. Push chest upward.' },
      { name:'Supine Spinal Twist',     duration:'45s/side', instruction:'Lying down. Knees to one side. Shoulders flat. Look opposite to knees.' },
    ],
  },
}

const getStretchesForSession = (exercises, lang) => {
  const groups = [...new Set(exercises.map(e => e.muscle_group))]
  const result = []
  groups.forEach(g => {
    const s = STRETCHES[g]?.[lang] || STRETCHES[g]?.fr
    if (s) s.forEach(stretch => { if (!result.find(r => r.name === stretch.name)) result.push(stretch) })
  })
  return result.slice(0, 6) // max 6 étirements
}

const VOLUME_TARGETS = {
  PUSH:  { compounds:2, accessories:2, isolations:2 },
  PULL:  { compounds:2, accessories:2, isolations:2 },
  LEGS:  { compounds:2, accessories:1, isolations:2 },
  FULL:  { compounds:3, accessories:2, isolations:2 },
  UPPER: { compounds:2, accessories:2, isolations:3 },
  LOWER: { compounds:2, accessories:2, isolations:2 },
}

const getInjuryExclusions = (injuries) => {
  if (!injuries) return []
  const s = injuries.toLowerCase()
  const excl = []
  if (/dos|lombaire|lumbar|back/.test(s)) excl.push('deadlift','barbell_squat','barbell_row','rdl')
  if (/genou|knee/.test(s)) excl.push('barbell_squat','leg_press','lunges','leg_extension')
  if (/épaule|epaule|shoulder/.test(s)) excl.push('ohp_barbell','db_shoulder_press','lateral_raise','skull_crushers')
  if (/coude|elbow/.test(s)) excl.push('ez_curl','skull_crushers','tricep_pushdown')
  if (/poignet|wrist/.test(s)) excl.push('barbell_row','ohp_barbell','skull_crushers')
  return excl
}

const filterByEquipment = (exercises, profile) => {
  if (profile.has_gym) return exercises
  const eq = profile.equipment || []
  const hasAny = (types) => types.some(t => eq.includes(t))
  return exercises.filter(e => {
    if (e.equipment === 'barbell')    return hasAny(['eqBar'])
    if (e.equipment === 'dumbbell')   return hasAny(['eqDb','eqKb'])
    if (e.equipment === 'cable')      return hasAny(['eqCbl'])
    if (e.equipment === 'machine')    return hasAny(['eqMch'])
    if (e.equipment === 'bodyweight') return true
    return true
  })
}

const getAutoSplit = (freq, history) => {
  const cycle = {
    1:['FULL'],
    2:['FULL','FULL'],
    3:['PUSH','PULL','LEGS'],
    4:['PUSH','PULL','LEGS','UPPER'],
    5:['PUSH','PULL','LEGS','PUSH','PULL'],
    6:['PUSH','PULL','LEGS','PUSH','PULL','LEGS'],
    7:['PUSH','PULL','LEGS','PUSH','PULL','LEGS','FULL'],
  }
  const pattern = cycle[freq] || cycle[3]
  const lastFocus = history[0]?.focus
  if (!lastFocus) return pattern[0]
  const idx = pattern.indexOf(lastFocus)
  return pattern[(idx + 1) % pattern.length]
}

const getProgressionNote = (exerciseId, history, scheme, lang) => {
  const prev = history.find(h => Array.isArray(h.exercises) && h.exercises.some(e => e.id === exerciseId))
  if (!prev) return lang === 'fr' ? 'Premier essai — trouvez votre charge.' : 'First attempt — find your working weight.'
  return lang === 'fr' ? 'Maintenez ou augmentez légèrement la charge.' : 'Maintain or slightly increase the load.'
}

const FINISHERS = {
  fr: { name:'Finisher métabolique', rounds:3, note:'Pas de repos entre les exercices. 90s entre les tours.', items:[{name:'Burpees',reps:'10'},{name:'Mountain Climbers',reps:'20'},{name:'Squats sautés',reps:'15'}] },
  en: { name:'Metabolic Finisher', rounds:3, note:'No rest between exercises. 90s between rounds.', items:[{name:'Burpees',reps:'10'},{name:'Mountain Climbers',reps:'20'},{name:'Jump Squats',reps:'15'}] },
}

export const generateWorkout = ({
  focusType, duration=45, profile, history=[], lang='fr',
  wantWarmup=true, wantFinisher=false, wantStretches=true,
}) => {
  const level  = profile?.level  || 'INTERMEDIATE'
  const goal   = profile?.goal   || 'MUSCLE_GAIN'
  const gymId  = profile?.gym_id || 'other'
  const freq   = profile?.freq   || 3

  const focus = focusType || getAutoSplit(freq, history)
  const scheme = SCHEMES[goal]?.[level] || SCHEMES.MUSCLE_GAIN.INTERMEDIATE
  const targets = VOLUME_TARGETS[focus] || VOLUME_TARGETS.PUSH
  const validFocuses = FOCUS_MAP[focus] || ['PUSH']

  const injExcl = getInjuryExclusions(profile?.injuries)

  // Pool combiné : exercices standard + domicile
  const allExercises = [...EXERCISES, ...HOME_EXERCISES]

  let pool = allExercises.filter(e =>
    validFocuses.includes(e.focus) &&
    e.difficulty.includes(level) &&
    !injExcl.includes(e.id)
  )
  pool = filterByEquipment(pool, profile)

  // Si domicile et pool vide → fallback bodyweight
  if (pool.length === 0) {
    pool = HOME_EXERCISES.filter(e => validFocuses.includes(e.focus))
  }

  const shuffle = arr => [...arr].sort(() => Math.random() - 0.5)
  const compounds   = shuffle(pool.filter(e => e.type === 'COMPOUND'))
  const accessories = shuffle(pool.filter(e => e.type === 'ACCESSORY'))
  const isolations  = shuffle(pool.filter(e => e.type === 'ISOLATION'))

  const picked = [
    ...compounds.slice(0, targets.compounds),
    ...accessories.slice(0, targets.accessories),
    ...isolations.slice(0, targets.isolations),
  ]

  // Déduplique par muscle group
  const usedGroups = new Set()
  const deduped = []
  for (const ex of picked) {
    if (!usedGroups.has(ex.muscle_group) || ex.type === 'ISOLATION') {
      deduped.push(ex)
      usedGroups.add(ex.muscle_group)
    }
  }

  const resolveEquipment = (ex) => {
    if (ex.equipment_key) return getGymEquipment(gymId, ex.equipment_key, lang)
    return ex.equip?.[lang] || ex.equip?.fr || ''
  }

  const usedIds = new Set(deduped.map(e => e.id))
  const mainExercises = deduped.map((ex, i) => ({
    ...ex,
    order:          i + 1,
    sets:           scheme.sets,
    reps:           scheme.reps,
    rest:           scheme.rest,
    rpe:            scheme.rpe,
    tempo:          scheme.tempo,
    display_name:   ex.name?.[lang]   || ex.name?.fr,
    display_muscle: ex.muscle?.[lang] || ex.muscle?.fr,
    display_fiber:  ex.fiber?.[lang]  || ex.fiber?.fr,
    display_equip:  resolveEquipment(ex),
    display_exec:   ex.exec?.[lang]   || ex.exec?.fr,
    display_tip:    ex.tip?.[lang]    || ex.tip?.fr,
    progress_note:  getProgressionNote(ex.id, history, scheme, lang),
    weight_log:     null, // sera rempli par l'utilisateur
  }))

  const warmupKey = focus in WARMUPS ? focus : 'FULL'
  const warmup    = wantWarmup ? (WARMUPS[warmupKey]?.[lang] || WARMUPS[warmupKey]?.fr || []) : []
  const cooldown  = wantStretches ? getStretchesForSession(mainExercises, lang) : []
  const finisher  = wantFinisher ? (FINISHERS[lang] || FINISHERS.fr) : null

  const mainTime = mainExercises.reduce((acc, ex) => acc + (ex.sets * 45 / 60) + (ex.sets * ex.rest / 60), 0)
  const estimatedDuration = Math.round((wantWarmup ? 8 : 0) + mainTime + (finisher ? 10 : 0) + (wantStretches ? 7 : 0))

  return {
    focus, goal, level, gymId,
    main:              mainExercises,
    warmup,
    cooldown,
    finisher,
    usedIds,
    exerciseCount:     mainExercises.length,
    totalSets:         mainExercises.reduce((a, e) => a + e.sets, 0),
    estimatedDuration,
  }
}

export const findReplacement = (currentEx, usedIds, profile, lang='fr') => {
  const level = profile?.level || 'INTERMEDIATE'
  const gymId = profile?.gym_id || 'other'
  const allExercises = [...EXERCISES, ...HOME_EXERCISES]
  const candidates = allExercises.filter(e =>
    e.id !== currentEx.id &&
    !usedIds.has(e.id) &&
    e.muscle_group === currentEx.muscle_group &&
    e.type === currentEx.type &&
    e.difficulty.includes(level)
  )
  if (!candidates.length) return null
  const scored = candidates.map(e => {
    let score = 0
    if (e.focus === currentEx.focus) score += 2
    if (e.equipment === currentEx.equipment) score += 3
    const similar = { barbell:['dumbbell'], dumbbell:['barbell','cable'], cable:['machine','dumbbell'], machine:['cable'], bodyweight:['dumbbell'] }
    if (similar[currentEx.equipment]?.includes(e.equipment)) score += 1
    return { ...e, _score: score }
  }).sort((a,b) => b._score - a._score)
  const best = scored[0]
  const resolveEquipment = (ex) => {
    if (ex.equipment_key) return getGymEquipment(gymId, ex.equipment_key, lang)
    return ex.equip?.[lang] || ex.equip?.fr || ''
  }
  return {
    ...best,
    sets: currentEx.sets, reps: currentEx.reps, rest: currentEx.rest,
    rpe: currentEx.rpe, tempo: currentEx.tempo,
    display_name:   best.name?.[lang]   || best.name?.fr,
    display_muscle: best.muscle?.[lang] || best.muscle?.fr,
    display_fiber:  best.fiber?.[lang]  || best.fiber?.fr,
    display_equip:  resolveEquipment(best),
    display_exec:   best.exec?.[lang]   || best.exec?.fr,
    display_tip:    best.tip?.[lang]    || best.tip?.fr,
    weight_log:     null,
  }
}