// src/data/gyms.js
// Salles de sport et leur équipement spécifique

export const GYMS = {
  onair: {
    id: 'onair',
    name: { fr: 'On Air Fitness', en: 'On Air Fitness' },
    brand: 'Hammer Strength / Technogym',
    equipment: {
      chest_press: { fr: 'Presse Hammer Strength Iso-Latérale', en: 'Hammer Strength Iso-Lateral Chest Press' },
      lat_machine: { fr: 'Tirage Technogym', en: 'Technogym Lat Pulldown' },
      cable:       { fr: 'Tour à câbles Technogym', en: 'Technogym Cable Tower' },
      leg_press:   { fr: 'Presse Hammer Strength', en: 'Hammer Strength Leg Press' },
      leg_curl:    { fr: 'Leg Curl Hammer Strength', en: 'Hammer Strength Leg Curl' },
      leg_ext:     { fr: 'Leg Extension Hammer Strength', en: 'Hammer Strength Leg Extension' },
    }
  },
  basicfit: {
    id: 'basicfit',
    name: { fr: 'Basic-Fit', en: 'Basic-Fit' },
    brand: 'Matrix / Technogym',
    equipment: {
      chest_press: { fr: 'Presse Matrix G3', en: 'Matrix G3 Chest Press' },
      lat_machine: { fr: 'Tirage Matrix', en: 'Matrix Lat Pulldown' },
      cable:       { fr: 'Câble Matrix Functional Trainer', en: 'Matrix Functional Trainer' },
      leg_press:   { fr: 'Presse Matrix', en: 'Matrix Leg Press' },
      leg_curl:    { fr: 'Leg Curl Matrix', en: 'Matrix Leg Curl' },
      leg_ext:     { fr: 'Leg Extension Matrix', en: 'Matrix Leg Extension' },
    }
  },
  fitnesspark: {
    id: 'fitnesspark',
    name: { fr: 'Fitness Park', en: 'Fitness Park' },
    brand: 'Life Fitness',
    equipment: {
      chest_press: { fr: 'Presse Life Fitness', en: 'Life Fitness Chest Press' },
      lat_machine: { fr: 'Tirage Life Fitness', en: 'Life Fitness Lat Pulldown' },
      cable:       { fr: 'Câble Life Fitness', en: 'Life Fitness Cable' },
      leg_press:   { fr: 'Presse Life Fitness', en: 'Life Fitness Leg Press' },
      leg_curl:    { fr: 'Leg Curl Life Fitness', en: 'Life Fitness Leg Curl' },
      leg_ext:     { fr: 'Leg Extension Life Fitness', en: 'Life Fitness Leg Extension' },
    }
  },
  keepcool: {
    id: 'keepcool',
    name: { fr: 'KeepCool', en: 'KeepCool' },
    brand: 'Technogym',
    equipment: {
      chest_press: { fr: 'Presse Technogym', en: 'Technogym Chest Press' },
      lat_machine: { fr: 'Tirage Technogym', en: 'Technogym Lat Pulldown' },
      cable:       { fr: 'Câble Technogym', en: 'Technogym Cable' },
      leg_press:   { fr: 'Presse Technogym', en: 'Technogym Leg Press' },
      leg_curl:    { fr: 'Leg Curl Technogym', en: 'Technogym Leg Curl' },
      leg_ext:     { fr: 'Leg Extension Technogym', en: 'Technogym Leg Extension' },
    }
  },
  other: {
    id: 'other',
    name: { fr: 'Autre salle', en: 'Other gym' },
    brand: 'Standard',
    equipment: {
      chest_press: { fr: 'Machine pectoraux', en: 'Chest Press Machine' },
      lat_machine: { fr: 'Machine tirage vertical', en: 'Lat Pulldown Machine' },
      cable:       { fr: 'Machine à câbles', en: 'Cable Machine' },
      leg_press:   { fr: 'Presse à cuisses', en: 'Leg Press Machine' },
      leg_curl:    { fr: 'Machine leg curl', en: 'Leg Curl Machine' },
      leg_ext:     { fr: 'Machine leg extension', en: 'Leg Extension Machine' },
    }
  },
  home: {
    id: 'home',
    name: { fr: 'Domicile', en: 'Home' },
    brand: 'Home gym',
    equipment: {
      chest_press: { fr: 'Pompes / Banc', en: 'Push-ups / Bench' },
      lat_machine: { fr: 'Barre de traction / Élastique', en: 'Pull-up Bar / Band' },
      cable:       { fr: 'Élastique', en: 'Resistance Band' },
      leg_press:   { fr: 'Goblet Squat', en: 'Goblet Squat' },
      leg_curl:    { fr: 'Nordic Curl / Élastique', en: 'Nordic Curl / Band' },
      leg_ext:     { fr: 'Squat bulgare', en: 'Bulgarian Split Squat' },
    }
  },
}

export const getGymEquipment = (gymId, key, lang = 'fr') => {
  return GYMS[gymId]?.equipment[key]?.[lang] ?? GYMS.other.equipment[key]?.[lang] ?? key
}