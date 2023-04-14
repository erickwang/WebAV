import { AVCanvas, AudioSprite, FontSprite, ImgSprite, VideoSprite } from '@webav/av-canvas'
import { exportMP4, exportWebM } from '../src/av-exporter'

const avCvs = new AVCanvas(document.querySelector('#app') as HTMLElement, {
  bgColor: '#333',
  resolution: {
    width: 1920,
    height: 1080
  }
})

console.log({ avCvs })

;(async (): Promise<void> => {
  // const is = new ImgSprite('img', 'https://neo-pages.bilibili.com/bbfe/neo/assets/img/neo-pages-overview.48f7bb81.png')
  // await avCvs.spriteManager.addSprite(is)
})().catch(console.error)
document.querySelector('#userMedia')?.addEventListener('click', () => {
  ;(async () => {
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    })
    const vs = new VideoSprite('userMedia', mediaStream, {
      audioCtx: avCvs.spriteManager.audioCtx
    })
    await avCvs.spriteManager.addSprite(vs)
  })().catch(console.error)
})

document.querySelector('#display')?.addEventListener('click', () => {
  ;(async () => {
    const mediaStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true
    })
    const vs = new VideoSprite('display', mediaStream, {
      audioCtx: avCvs.spriteManager.audioCtx
    })
    await avCvs.spriteManager.addSprite(vs)
  })().catch(console.error)
})

document.querySelector('#localImg')?.addEventListener('click', () => {
  ;(async () => {
    const [imgFH] = await (window as any).showOpenFilePicker({
      types: [{
        description: 'Images',
        accept: {
          'image/*': ['.png', '.gif', '.jpeg', '.jpg']
        }
      }]
    })
    const is = new ImgSprite('img', await imgFH.getFile())
    await avCvs.spriteManager.addSprite(is)
  })().catch(console.error)
})

document.querySelector('#localVideo')?.addEventListener('click', () => {
  ;(async () => {
    const [imgFH] = await (window as any).showOpenFilePicker({
      types: [{
        description: 'Video',
        accept: {
          'video/*': ['.webm', '.mp4']
        }
      }]
    })
    const vs = new VideoSprite('vs', await imgFH.getFile())
    await avCvs.spriteManager.addSprite(vs)
  })().catch(console.error)
})

document.querySelector('#localAudio')?.addEventListener('click', () => {
  ;(async () => {
    const [imgFH] = await (window as any).showOpenFilePicker({
      types: [{
        description: 'Audio',
        accept: {
          'audio/*': ['.mp3', '.wav', '.ogg']
        }
      }]
    })
    const as = new AudioSprite('vs', await imgFH.getFile())
    await avCvs.spriteManager.addSprite(as)
  })().catch(console.error)
})

document.querySelector('#fontExamp')?.addEventListener('click', () => {
  ;(async () => {
    const fs = new FontSprite('font', '示例文字')
    await avCvs.spriteManager.addSprite(fs)
  })().catch(console.error)
})

let stopRecod: (() => void) | null = null
document.querySelector('#startRecod')?.addEventListener('click', () => {
  ;(async () => {
    stopRecod?.()
    const el = document.querySelector('input[name=export-format]:checked') as HTMLInputElement
    const formatType = el.value
    const writer = await createFileWriter(formatType)
    if (formatType === 'webm') {
      stopRecod = await exportWebM(
        avCvs.captureStream(),
        writer
      )
    } else if (formatType === 'mp4') {
      stopRecod = await exportMP4(
        avCvs.captureStream(),
        { width: 1280, height: 720 },
        (stream) => {
          stream.pipeTo(writer).catch(console.error)
        }
      )
    }
  })().catch(console.error)
})
document.querySelector('#stopRecod')?.addEventListener('click', () => {
  stopRecod?.()
  stopRecod = null
  alert('已完成')
})

async function createFileWriter (extName: string): Promise<FileSystemWritableFileStream> {
  const fileHandle = await window.showSaveFilePicker({
    suggestedName: `WebAv-export-${Date.now()}.${extName}`
  })
  return await fileHandle.createWritable()
}

export {}