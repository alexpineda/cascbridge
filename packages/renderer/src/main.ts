import renderNodejsApi from '@/samples/nodejs-api'
import renderSerialport from '@/samples/native-modules/serialport'
import '@/samples/es-modules'
import './style.css'

const app = document.querySelector<HTMLDivElement>('#app')!

app.innerHTML = renderHTML()

window.removeLoading()

function renderHTML() {
  return `
  <div style="height:24px;"></div>
  <div class="logo-box">
    <img height="124" src="./logo.svg" />
  </div>
  ${renderNodejsApi()}
  ${renderSerialport()}
`
}
