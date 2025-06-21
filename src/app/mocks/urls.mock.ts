enum DrumSamplesFolderNames {
  '4OP-FM' = '4OP-FM', //!
  Bongos = 'Bongos',
  CR78  = 'CR78',
  KPR77 = 'KPR77',    //!
  Kit3  = 'Kit3',
  Kit8  = 'Kit8',      //!
  LINN  = 'LINN',
  R8  = 'R8',
  Stark = 'Stark',    //!
  Techno  = 'Techno', //!
}

//Techno - is standart
const TECHNO_INSTRUMENTS_FOLDER_NAME = DrumSamplesFolderNames.LINN;

export const MOCK_SAMPLE_URLS = {
  tom: `https://tonejs.github.io/audio/drum-samples/${TECHNO_INSTRUMENTS_FOLDER_NAME}/tom1.mp3`,
  kick: `https://tonejs.github.io/audio/drum-samples/${TECHNO_INSTRUMENTS_FOLDER_NAME}/kick.mp3`,
  hihat: `https://tonejs.github.io/audio/drum-samples/${TECHNO_INSTRUMENTS_FOLDER_NAME}/hihat.mp3`,
  snare: `https://tonejs.github.io/audio/drum-samples/${TECHNO_INSTRUMENTS_FOLDER_NAME}/snare.mp3`,
  //non techno samples:
  cookieTin: `https://tonejs.github.io/audio/berklee/CookieTin3.mp3`,
  aprNote: `https://tonejs.github.io/audio/berklee/Arp_note.mp3`,
  //analogsynth_octaves_lowmid: `https://tonejs.github.io/audio/berklee/Analogsynth_octaves_lowmid.mp3`,
  fM_dubhit2: `https://tonejs.github.io/audio/berklee/FM_dubhit2.mp3`,
  //fishertone_c4_1: `https://tonejs.github.io/audio/berklee/fishertone_c4_1.mp3`,
  //fM_dubhit3: `https://tonejs.github.io/audio/berklee/FM_dubhit3.mp3`,
  diffusor3: `https://tonejs.github.io/audio/impulse-responses/diffusor3.mp3`,
  wildecho: `https://tonejs.github.io/audio/impulse-responses/wildecho.mp3`,
  //filter_telephone: `https://tonejs.github.io/audio/impulse-responses/filter-telephone.mp3`,
  //filter_midbandpass: `https://tonejs.github.io/audio/impulse-responses/filter-midbandpass.mp3`,
  //filter_lopass160: `https://tonejs.github.io/audio/impulse-responses/filter-lopass160.mp3`,
  //birds_in_a_park: `https://tonejs.github.io/audio/berklee/birds_in_a_park.mp3`,
  //longsynth3: `https://tonejs.github.io/audio/berklee/Longsynth3.mp3`,
  //longsynth6: `https://tonejs.github.io/audio/berklee/Longsynth6.mp3`,
  //ping2: `https://tonejs.github.io/audio/berklee/Pling2.mp3`,
  //pling1: `https://tonejs.github.io/audio/berklee/Pling1.mp3`,
  bowed_cymbal_1b: `https://tonejs.github.io/audio/berklee/bowed_cymbal_1b.mp3`,
  crowd3: `https://tonejs.github.io/audio/berklee/crowd3.mp3`,
  //kalimba_1: `https://tonejs.github.io/audio/berklee/Kalimba_1.mp3`,
  //kalimba_2: `https://tonejs.github.io/audio/berklee/Kalimba_2.mp3`,
  blackboardHit1: `https://tonejs.github.io/audio/berklee/BlackboardHit1.mp3`,
  //shortsynth_mid: `https://tonejs.github.io/audio/berklee/Shortsynth_mid.mp3`,
  fuzz_bass_1: `https://tonejs.github.io/audio/berklee/fuzz_bass_1.mp3`,
  //guitar_pick_2: `https://tonejs.github.io/audio/berklee/guitar_pick_2.mp3`,
  femalevoice_oo: `https://tonejs.github.io/audio/berklee/femalevoice_oo_femalevoice_oo_A3.mp3`,
  femalevoices_aa: `https://tonejs.github.io/audio/berklee/femalevoices_aa2_A3.mp3`,
  paula: `pauli.wav`,
  sasha: `sasha.wav`,
};
