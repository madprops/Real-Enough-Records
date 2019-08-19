const R = {}

R.letters = 'abcdefghijklmnopqrstuvwxyz'
R.entropy_created = false
R.chosen_stimulant = false
R.started = false

R.init = function()
{
  let mode = R.check_mode()

  if(mode === 'new')
  {
    R.start_mouse_detection()
    R.start_sign()
    R.show_intro()
  }

  else if(mode === 'existing')
  {
    R.show_existing()
  }
}

R.$ = function(s, parent=false)
{
    if(!parent)
    {
        parent = document
    }

    return parent.querySelector(s)
}

R.$$ = function(s, parent=false, direct=false)
{
    if(!parent)
    {
        parent = document
    }

    let items = Array.from(parent.querySelectorAll(s))
    
    if(direct)
    {
        items = items.filter(node => node.parentNode === parent)
    }

    return items
}

R.get_param = function(param)
{
  let result = null, tmp = []
  let items = location.search.substr(1).split("&")

  for (let i=0; i<items.length; i++) 
  {
      tmp = items[i].split("=")

      if(tmp[0] === param)
      {
        result = decodeURIComponent(tmp[1])
      }
  }

  return result
}

R.check_mode = function()
{
  R.eb_bname = R.get_param('bname')
  R.eb_hash = R.get_param('hash')

  if(R.eb_bname && R.eb_hash)
  {
    return 'existing'
  }

  else
  {
    return 'new'
  }
}

R.show_existing = function()
{
  R.prepare_band(R.eb_bname, R.eb_hash)
}

R.show_intro = function()
{
  let strings = 
  [
    'Creating space...',
    'Educating kernel...',
    'Finding a comfy couch...',
    'Band creator ready'
  ]

  let options = 
  {
    strings: strings,
    typeSpeed: 40,
    showCursor: false,
    onComplete: function()
    {
      let main = R.$('#main')
      main.style.top = '50px'
      let content = R.$('#content')

      setTimeout(function()
      {
        content.style.display = 'flex'
        setTimeout(function()
        {
          content.style.opacity = 1
          R.started = true
        }, 500)
      }, 700)
    }
  }

  new Typed('#title', options)
}

R.start_mouse_detection = function()
{
  let eb = R.$('#entropy_box')
  let ebt = R.$('#entropy_text')
  let ebc = R.$('#entropy_checkmark')
  let sms = R.$('#stimulants')
  let create = R.$('#create')

  let entropy_function = function(e)
  {
    if(!R.started || R.entropy_created)
    {
      return false
    }

    let d = Date.now()
    let i = d % R.letters.length
    let i2 = Math.floor(d / 2) % R.letters.length

    ebt.textContent = ebt.textContent + R.letters[i] + R.letters[i2]

    if(eb.scrollHeight > eb.clientHeight)
    {
      R.entropy_created = true
      ebc.style.display = 'initial'
      ebt.style.opacity = 0.5
    }
  }

  eb.addEventListener('mousemove', entropy_function)
  eb.addEventListener('touchmove', entropy_function)

  sms.addEventListener('click', function(e)
  {
    if(R.chosen_stimulant)
    {
      return false
    }

    let sm = e.target.closest('.stimulant')

    if(!sm)
    {
      return false
    }

    R.chosen_stimulant = sm.dataset.type
    sms.classList.remove('stimulants_active')
    sm.classList.add('chosen_stimulant')
  })

  create.addEventListener('click', function(e)
  {
    let bn = R.$('#band_name').value.substring(0, 50).trim()
    let en = R.$('#entropy_text').textContent.trim()
    let sn = R.$('#sign_checkbox').checked
    
    if(!bn || !R.chosen_stimulant || !R.entropy_created)
    {
      return false
    }

    let s = `${bn}_${R.chosen_stimulant}_${en}_${JSON.stringify(sn)}`.substring(0, 500).trim()
    R.rng = new Math.seedrandom(s)
    R.prepare_band(bn, R.get_hash(s))
  })
}

R.prepare_band = function(bn, hash)
{
    let gbn = R.$('#gen_band_name')
    R.hash = hash
    R.rng = new Math.seedrandom(R.hash)
    R.country = R.countries[R.get_random_int(0, R.countries.length - 1)]
    R.$('#country').textContent = R.country
    R.show_members()
    R.$('#avatar').dataset.jdenticonValue = R.hash
    jdenticon()
    let url = `${document.location.href}?bname=${encodeURIComponent(bn)}&hash=${R.hash}`
    R.$('#share_link_input').value = url

    gbn.textContent = 'Nice'
    R.$('#content').style.opacity = 0

    R.Songs.start()
    window.scrollTo(0, 0)

    setTimeout(function()
    {
      R.$('#main').style.display = 'none'
      R.$('#main_2').style.display = 'flex'
      setTimeout(function()
      {
        R.$('#content_2').style.opacity = 1
        gbn.textContent = R.camel(bn)
      }, 800)
    }, 1000)
}

R.get_hash = function(s)
{
  let n = R.get_random_int(4, 9)
  let hash = ''

  for(let i=0; i<n; i++)
  {
    let ri = R.get_random_int(0, R.letters.length - 1)
    hash += R.letters[ri]
  }

  return hash
}

R.start_sign = function()
{
  let sc = R.$('#sign_checkbox')
  let scm = R.$('#sign_message')

  sc.checked = false

  sc.addEventListener('change', function(e)
  {
    if(sc.checked)
    {
      scm.textContent = 'We will click Upload for you!'
      sc.disabled = true
    }
  })
}

R.get_random_int = function(min, max)
{
    return Math.floor(R.rng() * (max - min + 1) + min)
}

R.show_members = function()
{
  let members = R.$('#members')
  let n = R.get_random_int(2, 5)

  for(let i=0; i<n; i++)
  {
    let name
    let wom = R.get_random_int(0, 1)

    if(wom === 0)
    {
      name = R.woman_names[R.get_random_int(0, R.woman_names.length - 1)]
    }

    else
    {
      name = R.man_names[R.get_random_int(0, R.man_names.length - 1)]
    }
    
    let item = document.createElement('div')
    item.textContent = name
    members.append(item)
  }
}

R.camel = function(text)
{
  return text.toLowerCase()
    .split(' ')
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join(' ')
}