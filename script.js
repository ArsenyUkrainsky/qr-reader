const appForm = document.querySelector('#qr-form')
const message = appForm.querySelector('.message')

function onSucccess(data) {
  console.log('Succcess data: ', data)
  const {currentDate, currentId, lastRow, success} = data
  if (success) {
    message.textContent = `болельщик с номером ${currentId} зарегистрирован от ${currentDate}`
    message.classList.add('message__active')
    setTimeout(() => message.classList.remove('message__active'), 900)
    const input = appForm.querySelector('input')
    appForm.reset()
    input.focus()
  } else {
    message.textContent = `болельщик с номером ${currentId} НЕ зарегистрирован`
    message.classList.add('message__active_error')
    setTimeout(() => message.classList.remove('message__active_error'), 900)
    const input = appForm.querySelector('input')
    appForm.reset()
    input.focus()
  }
}

function onError(errorMessage) {
  console.log('errorMessage: ', errorMessage)
  message.textContent = 'Ошибка !'
  message.classList.add('message__active_error')
  setTimeout(() => message.classList.remove('message__active_error'), 900)
  const input = appForm.querySelector('input')
  appForm.reset()
  input.focus()
}

function sendData(data) {
  const params = new URLSearchParams(data).toString()
  console.log(data)
  return fetch(
    'https://script.google.com/macros/s/AKfycbzzCb0fvO2aPwOWUOTUwHhx5PTUr3WsrrRQ9ys2ikQNb8XXxR20whkMO68MstRbzPIFOw/exec',
    {
      method: 'POST',
      redirect: 'follow',
      body: params,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
      // credentials: 'include',
      // mode: 'no-cors',
      
    }
  )
    .then((response) => response.json())
    .then(onSucccess)
    .catch(onError)
}

function onScanSuccess(decodedText, decodedResult) {
  console.log('decodedText', decodedText, decodedResult)
  sendData({ fanid: decodedText })
}

function onScanError(errorMessage) {
  console.log('error', errorMessage)
}

var html5QrcodeScanner = new Html5QrcodeScanner('qr-reader', { fps: 10, qrbox: 250 })
html5QrcodeScanner.render(onScanSuccess, onScanError)

// form action
function serializeForm(formNode) {
  const { elements } = formNode
  return Array.from(elements)
    .filter((item) => !!item.name)
    .reduce((a, { name, value }) => ({ ...a, [name]: value }), {})
}

function checkValidity(event) {
  const formNode = event.target.form
  const isValid = formNode.checkValidity()

  formNode.querySelector('button').disabled = !isValid
}

function handleFormSubmit(e) {
  e.preventDefault()
  const data = serializeForm(appForm)
  sendData(data)
}

appForm.addEventListener('submit', handleFormSubmit)
appForm.addEventListener('input', checkValidity)

// qr-reader style
const qrReader = document.querySelector('#qr-reader')
qrReader.firstElementChild.querySelector('img').remove()
qrReader.removeAttribute('style')

const swaplink = document.querySelector('#qr-reader__dashboard_section_swaplink')
swaplink.style = 'opacity: 0'

const button = document.querySelector('#qr-reader__camera_permission_button')
if (button) {
  button.textContent = 'Запросить разрешение камеры'
  button.classList.add('buttom-id-sent')
}

// serviceWorker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('sw.js').then(
      function (registration) {
        // Registration was successful
        console.log('ServiceWorker registration successful with scope: ', registration.scope)
      },
      function (err) {
        // registration failed :(
        console.log('ServiceWorker registration failed: ', err)
      }
    )
  })
}
