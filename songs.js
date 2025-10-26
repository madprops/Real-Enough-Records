R.Songs = {}
R.Songs.num_synths = 7
R.Songs.num_loops = 14
R.Songs.current_song = -1
R.Songs.rng

R.Songs.get_random_int = (min, max, exclude = undefined) => {
  let num = Math.floor(R.Songs.rng() * (max - min + 1) + min)

  if (exclude !== undefined) {
    if (num === exclude) {
      if (num + 1 <= max) {
        num = num + 1
      }
      else if (num - 1 >= min) {
        num = num - 1
      }
    }
  }

  return num
}

R.Songs.notes = [
  `C2`, `E2`, `G2`, `A2`,
  `C3`, `D3`, `E3`, `G3`, `A3`, `B3`,
  `C4`, `D4`, `E4`, `G4`, `A4`, `B4`, `C5`,
]

R.Songs.speeds = [
  `1n`, `2n`, `3n`, `4n`, `5n`, `6n`, `7n`, `8n`, `9n`,
]

R.Songs.delays = [
  100, 200, 300, 400, 600, 700, 800, 900,
]

R.Songs.releases = [
  0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9,
]

R.Songs.get_random_note = () => {
  return R.Songs.notes[R.Songs.get_random_int(0, R.Songs.notes.length - 1)]
}

R.Songs.get_random_speed = () => {
  return R.Songs.speeds[R.Songs.get_random_int(0, R.Songs.speeds.length - 1)]
}

R.Songs.get_random_delay = () => {
  return R.Songs.delays[R.Songs.get_random_int(0, R.Songs.delays.length - 1)]
}

R.Songs.get_random_release = () => {
  return R.Songs.releases[R.Songs.get_random_int(0, R.Songs.releases.length - 1)]
}

R.Songs.get_song_name = (n) => {
  let s = ``

  for (let i = 0; i < n; i++) {
    let word = R.words[R.Songs.get_random_int(0, R.words.length - 1)]
    s += (word[0].toUpperCase() + word.slice(1)) + ` `
  }

  return s.trim()
}

R.Songs.create_songs = () => {
  let container = R.$(`#songs`)
  R.Songs.rng = new Math.seedrandom(R.hash)

  for (let i = 0; i < 10; i++) {
    let item = document.createElement(`div`)
    item.classList.add(`song`)

    let title = document.createElement(`div`)
    title.classList.add(`song_title`)
    title.textContent = R.Songs.get_song_name(R.Songs.get_random_int(1, 3))
    item.append(title)

    let play_button = document.createElement(`button`)
    play_button.textContent = `Play`
    play_button.id = `play_button_${i}`
    play_button.classList.add(`song_play_button`)

    play_button.addEventListener(`click`, () => {
      if (R.Songs.current_song === i) {
        R.Songs.stop()
      }
      else {
        R.Songs.play(i)
      }
    })

    item.append(play_button)
    container.append(item)
  }
}

R.Songs.create_instruments = () => {
  R.Songs.synth_1 = new Tone.DuoSynth({
    vibratoAmount: 0.5,
    vibratoRate: 5,
    portamento: 0.1,
    harmonicity: 1.005,
    volume: 5,
    voice0: {
      volume: -2,
      oscillator: {
        type: `sawtooth`
      },
      filter: {
        Q: 1,
        type: `lowpass`,
        rolloff: -24
      },
      envelope: {
        attack: 0.01,
        decay: 0.25,
        sustain: 0.4,
        release: 1.2
      },
      filterEnvelope: {
        attack: 0.001,
        decay: 0.05,
        sustain: 0.3,
        release: 2,
        baseFrequency: 100,
        octaves: 4
      }
    },
    voice1: {
      volume: -10,
      oscillator: {
        type: `sawtooth`
      },
      filter: {
        Q: 2,
        type: `bandpass`,
        rolloff: -12
      },
      envelope: {
        attack: 0.25,
        decay: 4,
        sustain: 0.1,
        release: 0.8
      },
      filterEnvelope: {
        attack: 0.05,
        decay: 0.05,
        sustain: 0.7,
        release: 2,
        baseFrequency: 5000,
        octaves: -1.5
      }
    }
  }).toMaster()

  R.Songs.synth_2 = new Tone.PolySynth(3, Tone.Synth, {
    oscillator: {
      type: `fatsawtooth`,
      count: 3,
      spread: 30
    },
    envelope: {
      attack: 0.01,
      decay: 0.1,
      sustain: 0.5,
      release: 0.4,
      attackCurve: `exponential`
    },
  }).toMaster()

  R.Songs.synth_3 = new Tone.PolySynth(2, Tone.Synth, {
    oscillator: {
      type: `fatsawtooth`,
      count: 2,
      spread: 20
    },
    envelope: {
      attack: 0.05,
      decay: 0.3,
      sustain: 0.3,
      release: 0.8,
      attackCurve: `linear`
    },
  }).toMaster()

  R.Songs.synth_4 = new Tone.FMSynth({
    harmonicity: 1,
    modulationIndex: 3.5,
    carrier: {
      oscillator: {
        type: `custom`,
        partials: [0, 1, 0, 2]
      },
      envelope: {
        attack: 0.08,
        decay: 0.3,
        sustain: 0,
      },
    },
    modulator: {
      oscillator: {
        type: `square`
      },
      envelope: {
        attack: 0.1,
        decay: 0.2,
        sustain: 0.3,
        release: 0.01
      },
    }
  }).toMaster()

  R.Songs.synth_5 = new Tone.FMSynth({
    harmonicity: 1,
    modulationIndex: 0.1,
    carrier: {
      oscillator: {
        type: `custom`,
        partials: [0, 1, 0, 2]
      },
      envelope: {
        attack: 0.6,
        decay: 0.3,
        sustain: 0,
      },
    },
    modulator: {
      oscillator: {
        type: `square`
      },
      envelope: {
        attack: 0.1,
        decay: 10,
        sustain: 4,
        release: 1
      },
    }
  }).toMaster()

  R.Songs.synth_6 = new Tone.FMSynth({
    harmonicity: 1,
    modulationIndex: 10,
    carrier: {
      oscillator: {
        type: `custom`,
        partials: [0, 1, 0, 2]
      },
      envelope: {
        attack: 0.6,
        decay: 0.3,
        sustain: 0,
      },
    },
    modulator: {
      oscillator: {
        type: `square`
      },
      envelope: {
        attack: 0.1,
        decay: 10,
        sustain: 4,
        release: 1
      },
    }
  }).toMaster()

  R.Songs.synth_7 = new Tone.FMSynth({
    harmonicity: 3,
    modulationIndex: 33,
    carrier: {
      oscillator: {
        type: `custom`,
        partials: [0, 4, 0, 2]
      },
      envelope: {
        attack: 0.6,
        decay: 0.3,
        sustain: 0,
      },
    },
    modulator: {
      oscillator: {
        type: `square`
      },
      envelope: {
        attack: 0.1,
        decay: 10,
        sustain: 4,
        release: 1
      },
    }
  }).toMaster()

  for (let i = 1; i <= R.Songs.num_loops; i++) {
    R.Songs[`loop_${i}`] = new Tone.Player({
      url: `./audio/loop_${i}.mp3`,
      loop: true,
    }).toMaster()
  }
}

R.Songs.play = (num) => {
  if (R.Songs.current_song >= 0) {
    R.Songs.stop()
  }

  let button = R.$(`#play_button_${num}`)
  button.textContent = `Stop`
  button.classList.add(`song_play_button_playing`)

  R.Songs.rng = new Math.seedrandom(`${R.hash}-${num}`)
  R.Songs.current_song = num

  let s1 = R.Songs.get_random_int(1, R.Songs.num_synths)
  let s2 = R.Songs.get_random_int(1, R.Songs.num_synths, s1)

  let syn1 = R.Songs[`synth_${s1}`]
  let syn2 = R.Songs[`synth_${s2}`]

  R.Songs.synth_1_interval = setInterval(() => {
    syn1.triggerAttackRelease(R.Songs.get_random_note(), R.Songs.get_random_release())
  }, R.Songs.get_random_delay())

  R.Songs.synth_2_interval = setInterval(() => {
    syn2.triggerAttackRelease(R.Songs.get_random_note(), R.Songs.get_random_release())
  }, R.Songs.get_random_delay())

  let ls1 = R.Songs.get_random_int(1, R.Songs.num_loops)
  let ls2 = R.Songs.get_random_int(1, R.Songs.num_loops, ls1)

  R.Songs.loop1 = R.Songs[`loop_${ls1}`]
  R.Songs.loop2 = R.Songs[`loop_${ls2}`]

  let start_loop = (loop) => {
    if (loop.buffer.loaded) {
      loop.start()
    }
    else {
      loop.buffer.once(`load`, () => {
        loop.start()
      })
    }
  }

  start_loop(R.Songs.loop1)
  start_loop(R.Songs.loop2)
}

R.Songs.stop = () => {
  clearInterval(R.Songs.synth_1_interval)
  clearInterval(R.Songs.synth_2_interval)
  R.Songs.loop1.stop()
  R.Songs.loop2.stop()
  R.Songs.current_song = -1

  for (let i = 0; i < 10; i++) {
    let button = R.$(`#play_button_${i}`)
    button.textContent = `Play`
    button.classList.remove(`song_play_button_playing`)
  }
}

R.Songs.start = () => {
  R.Songs.create_instruments()
  R.Songs.create_songs()
}