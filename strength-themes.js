const Nightmare = require('nightmare');
const nightmare = Nightmare( {show: true} );
const fs = require('fs');

nightmare
  .goto('https://www.gallupstrengthscenter.com/Home/en-US/CliftonStrengths-Themes-Domains')
  .wait(200)
  .evaluate(() => {
    const themeHeaders = [...document.querySelectorAll('ol.c-theme-list li.c-theme-list__item')];

    const themeData = themeHeaders.map(theme => {      
      let strengthsTitle = theme.querySelector('.c-theme-list__theme-header').innerText;
      let description = theme.querySelector('.c-theme-list__item p').innerText;

      return { strengthsTitle, description }
    })

    return themeData;
  })
  .end()
  .then((result) => {
    let output = JSON.stringify(result, null, 2);

    fs.writeFile('./strength-themes-data.json', output, 'utf8', err = {
      if(err) {
        return console.log(err)
      }
    });

    console.log('File was saved')
  })
  .catch(error => {
    console.log(`something went wrong ${error}`)
  })