# 适配器模式

适配器模式解决两个接口不兼容的问题，如：音频播放器

```js
class Mp4 {
  play() {
    console.log("it is mp4");
  }
}
class Video {
  play() {
    console.log("is is video");
  }
}
class Media {
  constructor(type) {
    if (type === "mp4") this.type = new Mp4();
    else if (type === "video") this.type = new Video();
  }
  play() {
    this.type.play();
  }
}
class AudioPlayer {
  play(type) {
    if (type === "mp3") {
      console.log("it is mp3");
    } else if (type === "mp4" || type === "video") {
      new Media(type).play();
    }
  }
}
const audio = new AudioPlayer();
audio.play("mp4");
//it is mp4
```

## 应用场景

::: tip 提示
未完待续
:::
