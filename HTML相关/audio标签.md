> MDN文档 ：https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/audio

## 简介

HTML `` 元素用于在文档中嵌入音频内容。 `` 元素可以包含一个或多个音频资源， 这些音频资源可以使用 `src` 属性或者`` 元素来进行描述：浏览器将会选择最合适的一个来使用。也可以使用 `MediaStream` 将这个元素用于流式媒体。

## 属性

- `autoplay`：布尔值属性；声明该属性，音频会尽快自动播放，不会等待整个音频文件下载完成。
- `controls`：如果声明了该属性，浏览器将提供一个包含声音，播放进度，播放暂停的控制面板，让用户可以控制音频的播放。
- `currentTime`：读取 `currentTime` 属性将返回一个双精度浮点值，用以标明以秒为单位的当前音频的播放位置。
- `duration`：只读，这是一个双精度浮点数，指明了音频在时间轴中的持续时间（总长度），以秒为单位。
- `loop`：布尔属性；如果声明该属性，将循环播放音频。
- `src`：嵌入的音频的URL。

## 事件

| 事件名称       | 触发时机                                                     |
| -------------- | ------------------------------------------------------------ |
| audioprocess   | 一个 ScriptProcessorNode 的输入缓冲区已经准备开始处理。      |
| canplay        | 浏览器已经可以播放媒体，但是预测已加载的数据不足以在不暂停的情况下顺利将其播放到结尾（即预测会在播放时暂停以获取更多的缓冲区内容) |
| canplaythrough | 浏览器预测已经可以在不暂停的前提下将媒体播放到结束。         |
| complete       | 一个 OfflineAudioContext 的渲染已经中止。                    |
| durationchange | duration 属性发生了变化。                                    |
| emptied        | 媒体置空。举个例子，当一个媒体已经加载（或部分加载）的情况下话调用 load() 方法，这个事件就将被触发。 |
| ended          | 播放到媒体的结束位置，播放停止。                             |
| loadeddata     | 媒体的第一帧加载完成。                                       |
| loadedmetadata | 元数据加载完成。                                             |
| pause          | 播放暂停。                                                   |
| play           | 播放开始。                                                   |
| playing        | 因为缺少数据而暂停或延迟的状态结束，播放准备开始。           |
| ratechange     | 播放速度变化。                                               |
| seeked         | 一次获取 操作结束。                                          |
| seeking        | 一次获取 操作开始。                                          |
| timeupdate     | 由 currentTime 指定的时间更新。                              |
| volumechange   | 音量变化。                                                   |
| waiting        | 因为暂时性缺少数据，播放暂停                                 |