$(document).ready(() => {

  $('.submit').on('click', async (e) => {
    e.preventDefault() 
    const name = $('.name').val()
    const email = $('.email').val()
    
    console.log('name', name, 'email', email)

    const response = await fetch('/authenticate', {
      method: 'POST',
      body: JSON.stringify({name, email}),
      headers: {'Content-Type': 'application/json'}
    })

    const key = await response.json()
    const keyDisplay = $('.token')

    keyDisplay.text(`JWT: ${key}`)
  })
})

