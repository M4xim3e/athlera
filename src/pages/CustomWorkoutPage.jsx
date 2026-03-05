import { useState } from 'react'
import { useAuth }    from '../contexts/AuthContext'
import { useLang }    from '../contexts/LangContext'
import { saveWorkout } from '../services/userService'
import { EXERCISES }   from '../services/workoutEngine'
import Icons  from '../components/ui/Icons'
import Button from '../components/ui/Button'

const ALL_EXERCISES = [
  // PECS
  { id: 'bench_press_barbell',       name_fr: 'Développé couché barre',         name_en: 'Barbell Bench Press',         muscle: 'Pectoraux'   },
  { id: 'bench_press_dumbbell',      name_fr: 'Développé couché haltères',      name_en: 'Dumbbell Bench Press',        muscle: 'Pectoraux'   },
  { id: 'incline_bench_press_barbell',name_fr:'Développé incliné barre',        name_en: 'Incline Barbell Press',       muscle: 'Pectoraux'   },
  { id: 'incline_bench_press_dumbbell',name_fr:'Développé incliné haltères',    name_en: 'Incline Dumbbell Press',      muscle: 'Pectoraux'   },
  { id: 'incline_chest_press_hammer',name_fr: 'Incline Chest Press Machine',    name_en: 'Incline Chest Press Machine', muscle: 'Pectoraux'   },
  { id: 'chest_press_machine',       name_fr: 'Chest Press Machine',            name_en: 'Chest Press Machine',         muscle: 'Pectoraux'   },
  { id: 'pec_fly_machine',           name_fr: 'Pec Fly Machine',                name_en: 'Pec Deck Fly',                muscle: 'Pectoraux'   },
  { id: 'cable_fly_mid',             name_fr: 'Écarté poulie milieu',           name_en: 'Cable Fly Mid',               muscle: 'Pectoraux'   },
  { id: 'cable_fly_low',             name_fr: 'Écarté poulie basse',            name_en: 'Low Cable Fly',               muscle: 'Pectoraux'   },
  { id: 'pushup',                    name_fr: 'Pompes',                         name_en: 'Push-ups',                    muscle: 'Pectoraux'   },
  // ÉPAULES
  { id: 'overhead_press_barbell',    name_fr: 'Développé militaire barre',      name_en: 'Overhead Press',              muscle: 'Épaules'     },
  { id: 'shoulder_press_machine',    name_fr: 'Shoulder Press Machine',         name_en: 'Shoulder Press Machine',      muscle: 'Épaules'     },
  { id: 'shoulder_press_dumbbell',   name_fr: 'Développé épaules haltères',     name_en: 'Dumbbell Shoulder Press',     muscle: 'Épaules'     },
  { id: 'lateral_raise_dumbbell',    name_fr: 'Élévation latérale haltères',    name_en: 'Dumbbell Lateral Raise',      muscle: 'Épaules'     },
  { id: 'lateral_raise_cable',       name_fr: 'Élévation latérale poulie',      name_en: 'Cable Lateral Raise',         muscle: 'Épaules'     },
  { id: 'reverse_pec_fly',           name_fr: 'Reverse Pec Fly Machine',        name_en: 'Reverse Pec Deck',            muscle: 'Épaules'     },
  // TRICEPS
  { id: 'skullcrusher',              name_fr: 'Barre au front (Skullcrusher)',   name_en: 'Skullcrusher',                muscle: 'Triceps'     },
  { id: 'triceps_pushdown_cable',    name_fr: 'Extension triceps poulie haute',  name_en: 'Triceps Pushdown',            muscle: 'Triceps'     },
  { id: 'triceps_pushdown_low_cable',name_fr: 'Triceps poulie basse',            name_en: 'Low Cable Triceps',           muscle: 'Triceps'     },
  { id: 'triceps_overhead_dumbbell', name_fr: 'Extension triceps haltère',       name_en: 'Overhead Triceps Extension',  muscle: 'Triceps'     },
  { id: 'dips',                      name_fr: 'Dips',                            name_en: 'Dips',                        muscle: 'Triceps'     },
  // DOS
  { id: 'lat_pulldown_vertical',     name_fr: 'Tirage vertical machine',         name_en: 'Lat Pulldown Machine',        muscle: 'Dos'         },
  { id: 'lat_pulldown_v_bar',        name_fr: 'Tirage vertical prise V',         name_en: 'V-Bar Lat Pulldown',          muscle: 'Dos'         },
  { id: 'seated_row_machine',        name_fr: 'Tirage horizontal machine',       name_en: 'Seated Row Machine',          muscle: 'Dos'         },
  { id: 'cable_row_u_bar',           name_fr: 'Tirage poulie horizontale prise U',name_en:'Cable Row U-Bar',             muscle: 'Dos'         },
  { id: 'barbell_row',               name_fr: 'Rowing barre',                    name_en: 'Barbell Row',                 muscle: 'Dos'         },
  { id: 'dumbbell_row',              name_fr: 'Rowing haltère unilatéral',       name_en: 'Single Arm Dumbbell Row',     muscle: 'Dos'         },
  { id: 'pullover_cable',            name_fr: 'Pull-over poulie corde',          name_en: 'Cable Pullover',              muscle: 'Dos'         },
  { id: 'rear_delt_cable',           name_fr: 'Arrière épaule poulie',           name_en: 'Rear Delt Cable Fly',         muscle: 'Dos'         },
  { id: 'traps_machine',             name_fr: 'Trapèze machine',                 name_en: 'Trap Machine Shrug',          muscle: 'Dos'         },
  { id: 'pullup',                    name_fr: 'Traction',                        name_en: 'Pull-up',                     muscle: 'Dos'         },
  { id: 'chin_up_bw',                name_fr: 'Traction supination',             name_en: 'Chin-up',                     muscle: 'Dos'         },
  // BICEPS
  { id: 'curl_barbell',              name_fr: 'Curl barre droite',               name_en: 'Barbell Curl',                muscle: 'Biceps'      },
  { id: 'curl_ez_bar',               name_fr: 'Curl barre EZ',                   name_en: 'EZ Bar Curl',                 muscle: 'Biceps'      },
  { id: 'curl_dumbbell_incline',     name_fr: 'Curl haltères banc incliné',      name_en: 'Incline Dumbbell Curl',       muscle: 'Biceps'      },
  { id: 'curl_hammer',               name_fr: 'Curl marteau',                    name_en: 'Hammer Curl',                 muscle: 'Biceps'      },
  { id: 'curl_machine',              name_fr: 'Curl biceps machine',             name_en: 'Machine Bicep Curl',          muscle: 'Biceps'      },
  { id: 'curl_preacher',             name_fr: 'Curl pupitre machine',            name_en: 'Preacher Curl Machine',       muscle: 'Biceps'      },
  // JAMBES
  { id: 'squat_barbell',             name_fr: 'Squat barre',                     name_en: 'Barbell Squat',               muscle: 'Jambes'      },
  { id: 'leg_press',                 name_fr: 'Leg Press',                       name_en: 'Leg Press',                   muscle: 'Jambes'      },
  { id: 'leg_extension',             name_fr: 'Leg Extension',                   name_en: 'Leg Extension',               muscle: 'Jambes'      },
  { id: 'leg_curl',                  name_fr: 'Leg Curl',                        name_en: 'Leg Curl',                    muscle: 'Jambes'      },
  { id: 'leg_adduction',             name_fr: 'Adducteurs machine',              name_en: 'Leg Adduction Machine',       muscle: 'Jambes'      },
  { id: 'romanian_deadlift',         name_fr: 'Soulevé de terre roumain',        name_en: 'Romanian Deadlift',           muscle: 'Jambes'      },
  { id: 'hip_thrust',                name_fr: 'Hip Thrust',                      name_en: 'Hip Thrust',                  muscle: 'Jambes'      },
  { id: 'calf_raise_machine',        name_fr: 'Mollet machine',                  name_en: 'Calf Raise Machine',          muscle: 'Jambes'      },
  { id: 'glute_bridge_bw',           name_fr: 'Pont fessier',                    name_en: 'Glute Bridge',                muscle: 'Jambes'      },
  // FULL / CORE
  { id: 'deadlift',                  name_fr: 'Soulevé de terre',                name_en: 'Deadlift',                    muscle: 'Full Body'   },
  { id: 'abs_cable',                 name_fr: 'Abdos corde poulie',              name_en: 'Cable Crunch',                muscle: 'Core'        },
]

const DEFAULT_SET = { reps: '10', weight: '', rest: 90 }

export default function CustomWorkoutPage({ onBack, onSaved }) {
  const { user } = useAuth()
  const { t, lang } = useLang()

  const [name,    setName]    = useState('')
  const [search,  setSearch]  = useState('')
  const [exercises, setExercises] = useState([])
  const [saving,  setSaving]  = useState(false)
  const [saved,   setSaved]   = useState(false)
  const [showLib, setShowLib] = useState(false)

  const filtered = ALL_EXERCISES.filter(ex => {
    const q = search.toLowerCase()
    const n = lang === 'fr' ? ex.name_fr : ex.name_en
    return n.toLowerCase().includes(q) || ex.muscle.toLowerCase().includes(q)
  })

  const addExercise = (ex) => {
    if (exercises.find(e => e.id === ex.id)) return
    setExercises(prev => [...prev, {
      ...ex,
      display_name: lang === 'fr' ? ex.name_fr : ex.name_en,
      sets_data: [{ ...DEFAULT_SET }],
    }])
    setShowLib(false)
    setSearch('')
  }

  const removeExercise = (id) => {
    setExercises(prev => prev.filter(e => e.id !== id))
  }

  const addSet = (exId) => {
    setExercises(prev => prev.map(e =>
      e.id === exId ? { ...e, sets_data: [...e.sets_data, { ...DEFAULT_SET }] } : e
    ))
  }

  const removeSet = (exId, idx) => {
    setExercises(prev => prev.map(e =>
      e.id === exId ? { ...e, sets_data: e.sets_data.filter((_, i) => i !== idx) } : e
    ))
  }

  const updateSet = (exId, idx, field, value) => {
    setExercises(prev => prev.map(e =>
      e.id === exId ? {
        ...e,
        sets_data: e.sets_data.map((s, i) => i === idx ? { ...s, [field]: value } : s)
      } : e
    ))
  }

  const handleSave = async () => {
    if (!name.trim() || exercises.length === 0) return
    setSaving(true)
    const workout = {
      focus: 'CUSTOM',
      goal: null,
      level: null,
      gymId: null,
      exerciseCount: exercises.length,
      totalSets: exercises.reduce((acc, e) => acc + e.sets_data.length, 0),
      estimatedDuration: null,
      is_custom: true,
      custom_name: name.trim(),
      main: exercises.map((ex, idx) => ({
        ...ex,
        order: idx + 1,
        sets: ex.sets_data.length,
        reps: ex.sets_data[0]?.reps || '10',
        rest: ex.sets_data[0]?.rest || 90,
        weight_log: ex.sets_data[0]?.weight || null,
        display_name: lang === 'fr' ? ex.name_fr : ex.name_en,
        display_muscle: ex.muscle,
        display_equip: '',
        display_fiber: ex.muscle,
        display_exec: '',
        display_tip: '',
        sets_data: ex.sets_data,
      })),
      warmup: [],
      cooldown: [],
      finisher: null,
      is_favorite: true,
    }
    await saveWorkout(user.id, workout)
    setSaving(false)
    setSaved(true)
    setTimeout(() => { onSaved?.() }, 1200)
  }

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg-base)', paddingBottom: 120 }}>

      {/* Header */}
      <div style={{
        padding: '20px 18px 16px',
        background: 'var(--bg-base)',
        borderBottom: '1px solid var(--border)',
        position: 'sticky', top: 0, zIndex: 10,
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <button onClick={onBack} style={{
          background: 'var(--surface-up)', border: '1px solid var(--border)',
          borderRadius: 10, padding: 8, cursor: 'pointer', display: 'flex',
        }}>
          <Icons.chevLeft size={16} color="var(--txt-sub)" />
        </button>
        <h1 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 26, color: 'var(--txt)', letterSpacing: '0.03em',
        }}>
          {lang === 'fr' ? 'Créer une séance' : 'Create Workout'}
        </h1>
      </div>

      <div style={{ padding: '20px 18px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Nom de la séance */}
        <div>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--txt-sub)', marginBottom: 8 }}>
            {lang === 'fr' ? 'Nom de la séance' : 'Workout Name'}
          </p>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder={lang === 'fr' ? 'ex: Push Lundi, Jambes Heavy...' : 'ex: Monday Push, Heavy Legs...'}
            style={{
              width: '100%', background: 'var(--surface)',
              border: '1.5px solid var(--border)', borderRadius: 14,
              padding: '14px 16px', fontSize: 15,
              color: 'var(--txt)', fontFamily: 'inherit', outline: 'none',
              boxSizing: 'border-box',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--acc)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
        </div>

        {/* Exercices ajoutés */}
        {exercises.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--txt-sub)' }}>
              {lang === 'fr' ? `Exercices (${exercises.length})` : `Exercises (${exercises.length})`}
            </p>

            {exercises.map((ex, exIdx) => (
              <div key={ex.id} style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 18, overflow: 'hidden',
              }}>
                {/* Ex header */}
                <div style={{
                  padding: '14px 16px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  borderBottom: '1px solid var(--border)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: 22, color: 'var(--acc)', lineHeight: 1,
                    }}>
                      {exIdx + 1}
                    </span>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--txt)', lineHeight: 1.2 }}>
                        {ex.display_name}
                      </p>
                      <p style={{ fontSize: 11, color: 'var(--txt-sub)', marginTop: 2 }}>
                        {ex.muscle}
                      </p>
                    </div>
                  </div>
                  <button onClick={() => removeExercise(ex.id)} style={{
                    background: 'rgba(255,69,58,0.08)', border: 'none',
                    borderRadius: 8, padding: 7, cursor: 'pointer', display: 'flex',
                  }}>
                    <Icons.x size={13} color="var(--err)" />
                  </button>
                </div>

                {/* Sets */}
                <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>

                  {/* Labels */}
                  <div style={{ display: 'grid', gridTemplateColumns: '32px 1fr 1fr 1fr 28px', gap: 6, alignItems: 'center' }}>
                    {['', lang === 'fr' ? 'Reps' : 'Reps', 'kg', lang === 'fr' ? 'Repos' : 'Rest', ''].map((lbl, i) => (
                      <span key={i} style={{ fontSize: 9, color: 'var(--txt-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'center' }}>
                        {lbl}
                      </span>
                    ))}
                  </div>

                  {ex.sets_data.map((set, setIdx) => (
                    <div key={setIdx} style={{ display: 'grid', gridTemplateColumns: '32px 1fr 1fr 1fr 28px', gap: 6, alignItems: 'center' }}>
                      <span style={{
                        fontFamily: "'Bebas Neue', sans-serif",
                        fontSize: 16, color: 'var(--acc-txt)', textAlign: 'center',
                      }}>
                        {setIdx + 1}
                      </span>

                      {/* Reps */}
                      <input
                        type="text" value={set.reps}
                        onChange={e => updateSet(ex.id, setIdx, 'reps', e.target.value)}
                        placeholder="10"
                        style={inputStyle}
                      />

                      {/* Poids */}
                      <input
                        type="number" value={set.weight}
                        onChange={e => updateSet(ex.id, setIdx, 'weight', e.target.value)}
                        placeholder="—"
                        style={inputStyle}
                      />

                      {/* Repos */}
                      <input
                        type="number" value={set.rest}
                        onChange={e => updateSet(ex.id, setIdx, 'rest', e.target.value)}
                        placeholder="90"
                        style={inputStyle}
                      />

                      {/* Supprimer série */}
                      {ex.sets_data.length > 1 && (
                        <button onClick={() => removeSet(ex.id, setIdx)} style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          display: 'flex', justifyContent: 'center',
                        }}>
                          <Icons.x size={11} color="var(--txt-muted)" />
                        </button>
                      )}
                    </div>
                  ))}

                  {/* Ajouter série */}
                  <button onClick={() => addSet(ex.id)} style={{
                    background: 'var(--surface-up)', border: '1px dashed var(--border)',
                    borderRadius: 10, padding: '8px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    marginTop: 4,
                  }}>
                    <Icons.plus size={12} color="var(--txt-sub)" />
                    <span style={{ fontSize: 12, color: 'var(--txt-sub)', fontFamily: 'inherit', fontWeight: 600 }}>
                      {lang === 'fr' ? 'Ajouter une série' : 'Add set'}
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bouton ajouter exercice */}
        <button onClick={() => setShowLib(true)} style={{
          background: 'var(--surface)', border: '2px dashed var(--border)',
          borderRadius: 18, padding: '18px',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          transition: 'all 0.15s',
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--acc)'}
        onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
        >
          <Icons.plus size={18} color="var(--acc-txt)" />
          <span style={{ fontSize: 15, color: 'var(--acc-txt)', fontWeight: 700, fontFamily: 'inherit' }}>
            {lang === 'fr' ? 'Ajouter un exercice' : 'Add exercise'}
          </span>
        </button>

        {/* Erreur si vide */}
        {saved && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', padding: '12px' }}>
            <Icons.check size={18} color="var(--ok)" />
            <span style={{ fontSize: 14, color: 'var(--ok)', fontWeight: 700 }}>
              {lang === 'fr' ? 'Séance enregistrée !' : 'Workout saved!'}
            </span>
          </div>
        )}
      </div>

      {/* Bouton sauvegarder fixe */}
      {exercises.length > 0 && name.trim() && !saved && (
        <div style={{
          position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
          width: '100%', maxWidth: 430,
          padding: '16px 18px 32px',
          background: 'linear-gradient(to top, var(--bg-base) 70%, transparent)',
        }}>
          <Button
            label={lang === 'fr' ? 'Enregistrer la séance' : 'Save Workout'}
            full loading={saving} onClick={handleSave}
            iconRight={<Icons.check size={15} color="var(--txt-inv)" />}
          />
        </div>
      )}

      {/* Bibliothèque — modal */}
      {showLib && (
        <>
          <div onClick={() => setShowLib(false)} style={{
            position: 'fixed', inset: 0, background: 'var(--overlay)', zIndex: 40,
          }} />
          <div style={{
            position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
            width: '100%', maxWidth: 430,
            background: 'var(--surface)',
            borderRadius: '24px 24px 0 0',
            border: '1px solid var(--border)',
            zIndex: 50, maxHeight: '80dvh',
            display: 'flex', flexDirection: 'column',
            animation: 'slideUp 0.28s cubic-bezier(0.16,1,0.3,1)',
          }}>
            {/* Handle */}
            <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
              <div style={{ width: 40, height: 4, background: 'var(--border)', borderRadius: 100 }} />
            </div>

            {/* Search */}
            <div style={{ padding: '12px 18px 8px' }}>
              <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: 'var(--txt)', marginBottom: 12 }}>
                {lang === 'fr' ? 'Bibliothèque' : 'Exercise Library'}
              </p>
              <div style={{ position: 'relative' }}>
                <input
                  autoFocus
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder={lang === 'fr' ? 'Rechercher un exercice...' : 'Search exercise...'}
                  style={{
                    width: '100%', background: 'var(--surface-up)',
                    border: '1.5px solid var(--border)', borderRadius: 12,
                    padding: '12px 16px', fontSize: 14,
                    color: 'var(--txt)', fontFamily: 'inherit', outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--acc)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>
            </div>

            {/* Liste */}
            <div style={{ overflowY: 'auto', padding: '4px 18px 24px', flex: 1 }}>
              {filtered.length === 0 && (
                <p style={{ fontSize: 13, color: 'var(--txt-muted)', textAlign: 'center', padding: '24px 0' }}>
                  {lang === 'fr' ? 'Aucun exercice trouvé' : 'No exercise found'}
                </p>
              )}
              {filtered.map(ex => {
                const alreadyAdded = exercises.find(e => e.id === ex.id)
                return (
                  <button key={ex.id} onClick={() => !alreadyAdded && addExercise(ex)} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    width: '100%', padding: '13px 14px', borderRadius: 14, marginBottom: 4,
                    background: alreadyAdded ? 'var(--acc-dim)' : 'transparent',
                    border: `1px solid ${alreadyAdded ? 'var(--acc)' : 'transparent'}`,
                    cursor: alreadyAdded ? 'default' : 'pointer',
                    fontFamily: 'inherit', textAlign: 'left',
                    transition: 'background 0.14s',
                  }}
                  onMouseEnter={e => { if (!alreadyAdded) e.currentTarget.style.background = 'var(--surface-up)' }}
                  onMouseLeave={e => { if (!alreadyAdded) e.currentTarget.style.background = 'transparent' }}
                  >
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 600, color: alreadyAdded ? 'var(--acc-txt)' : 'var(--txt)' }}>
                        {lang === 'fr' ? ex.name_fr : ex.name_en}
                      </p>
                      <p style={{ fontSize: 11, color: 'var(--txt-sub)', marginTop: 2 }}>
                        {ex.muscle}
                      </p>
                    </div>
                    {alreadyAdded
                      ? <Icons.check size={14} color="var(--acc-txt)" />
                      : <Icons.plus  size={14} color="var(--txt-muted)" />
                    }
                  </button>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

const inputStyle = {
  background: 'var(--surface-up)',
  border: '1px solid var(--border)',
  borderRadius: 10, padding: '9px 8px',
  fontSize: 14, color: 'var(--txt)',
  fontFamily: 'inherit', outline: 'none',
  textAlign: 'center', width: '100%',
  boxSizing: 'border-box',
}
