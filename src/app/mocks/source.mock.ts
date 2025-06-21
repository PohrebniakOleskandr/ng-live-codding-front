const SRC_MOCK ={
  synth: {
    seqs: [],
    variants: {
      'a': {
        effect: 'E1',
        rythm: 'R4',
        sound: 'S4',
      },
    },
    config: {
      effects: {
        'E1': {
          feedbackDelay: {
            delayTime: 0,
            feedback: 0.1,
            wet: 0.1,
          },
          reverb: {
            decay: 0,
          },
          distortion: {
            distortion: 0,
          },
          freeverb: {
            roomSize : 0.7 ,
            dampening : 3000
          },
        },
      },
      rythms: {
        'R1': 'X-X-X-X-X-X-X-X-',
        'R2': '1+2n3n',
        'R3': '0,1+2n',
        'R4': '--X-X-X-X-X-X---'
      },
      sounds: {
        'S1': {
          'X': {
            fr: '+[7,11,5]',
            duration: '16n',
            oscillator: {
              partials: [3.2, 0.12, 1.5, 0.1],
            },
          },
        },
        'S2': {
          'X': {
            fr: '+[251, 128, 601, 40, 200, 601, 128, 251]',
            duration: '16n',
            oscillator: {
              partials: [],
            },
          },
        },
        "S4": {
          "X": {
            "fr": "+[17, 12, 15, 22]",
            "duration": "2n",
            "oscillator": {
              "partials": [
                0.1,
                2,
                1.3,
                0.2
              ]
            }
          }
        }
      },
    },
  },
  membraneSynth: {
    seqs: [],
    variants: {
      'a': {
        effect: 'E1',
        rythm: 'R4',
        sound: 'S4',
      },
    },
    config: {
      effects: {
        'E1': {
          feedbackDelay: {
            delayTime: 0,
            feedback: 0.1,
            wet: 0.1,
          },
          reverb: {
            decay: 0,
          },
          distortion: {
            distortion: 0,
          },
          freeverb: {
            roomSize : 0.7 ,
            dampening : 3000
          },
        },
      },
      rythms: {
        'R1': 'X-X-X-X-X-X-X-X-',
        'R2': '1+2n3n',
        'R3': '0,1+2n',
        'R4': '--X-X-X-X-X-X---'
      },
      sounds: {
        'S1': {
          'X': {
            fr: '+[7,11,5]',
            duration: '16n',
            oscillator: {
              partials: [3.2, 0.12, 1.5, 0.1],
            },
          },
        },
        'S2': {
          'X': {
            fr: '+[251, 128, 601, 40, 200, 601, 128, 251]',
            duration: '16n',
            oscillator: {
              partials: [],
            },
          },
        },
        "S4": {
          "X": {
            "fr": "+[17, 12, 15, 22]",
            "duration": "2n",
            "oscillator": {
              "partials": [
                0.1,
                2,
                1.3,
                0.2
              ]
            }
          }
        }
      },
    },
  },
}





