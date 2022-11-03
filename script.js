const appForm = document.querySelector('#qr-form')
const message = appForm.querySelector('.message')

function onSucccess(data) {
  message.classList.add('message__active')
  setTimeout(() => message.classList.remove('message__active'), 500)
  const input = appForm.querySelector('input')
  appForm.reset()
  input.focus()
}

function onError(errorMessage) {
  console.log(errorMessage)
}

function sendData(data) {
  const params = new URLSearchParams(data).toString()
  return fetch(
    `https://script.google.com/macros/s/AKfycbzd31SwgQvWKQXWKDLGdToAlIyj_PjQn5VWx5SHJI2Hk35Bb2qDlXkTAGGjyVFTDJ16sA/exec?${params}`,
    {
      method: 'POST',
      credentials: 'include',
      mode: 'no-cors',
    }
  )
    .then(onSucccess)
    .catch(onError)
}

function onScanSuccess(decodedText, decodedResult) {
  console.log('decodedText', decodedText, decodedResult)
  sendData({ fanid: decodedText} )
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
