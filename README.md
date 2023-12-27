# Nothing Music Community
<img src="https://github.com/PreyK/Nothing-Music-Community/assets/1968543/a28c8794-b710-4ebd-871c-bc64a7f23a47" height="500"><img src="https://github.com/PreyK/Nothing-Music-Community/assets/1968543/4138183e-1fdd-4f94-a255-5c936207996a" height="500"><img src="https://github.com/PreyK/Nothing-Music-Community/assets/1968543/1b330caf-832d-40e6-98d8-a819e1c6cc94" height="500">

[Nothing](https://nothing.tech/) style minimal music player app for Android based a [community-projects](https://discord.com/channels/930878214237200394/1060597648475836497/1060597648475836497) design by [@alkids_art](https://bento.me/alkid).

Currently pretty barebones, all it does is plays your music in your /Music directory and looks cool.

Made with [fuseopen](https://fuseopen.com/) in [UX markup](https://fuseopen.com/docs/ux-markup/ux-markup.html) and [FuseJS](https://fuseopen.com/docs/fuse/reactive/javascript.html) with [UNO](https://fuseopen.com/docs/native-interop/foreign-code.html) native Java elements for Android.

### [Get the test .apk here](https://github.com/PreyK/Nothing-Music-Community/releases)

### Current Features
- [x] Album Art
- [x] Extracting metadata from the audio files if it has it (artist name, song name)
- [x] Play, Pause, Seek
- [x] Background playback
- [x] Audio vaweform visualization (currently just randomized bars)
- [ ] Shiffle
- [ ] Repeat
- [ ] Next/Prev
- [ ] Playlists
- [ ] Albums
- [ ] Android media notification (play, pause etc from the lock screen)
- [ ] PR's are welcome

### How to display album art
By default the app finds all your music in your Android /Music folder (\storage\emulated\0\Music)
If the folder containing the audio file has an image (.jpg, .jpeg, .png), it uses it for the album art.

Examples:

![image](https://github.com/PreyK/Nothing-Music-Community/assets/1968543/e833d62e-bb55-4ba2-96bc-d3b3cd1241fb)
![image](https://github.com/PreyK/Nothing-Music-Community/assets/1968543/dab6f064-c22e-401c-9c15-4bfe69bc8b9c)


### Artist and Song name
Reads it from the audio metadata.
You can set it in most modern operating systems.

![image](https://github.com/PreyK/Nothing-Music-Community/assets/1968543/de838c07-8b41-48c0-a011-f1890e8538ef)



### How to build
For now your phone and your server needs to be on the same network

1. Get set up with [fuseopen](https://fuseopen.com/docs/basics/supported-platforms.html). I recommend [fuse X studio](https://fuse-x.com/) because it's by far the easiest way to grab everything in one installer.
2. Open the project (where the .unoproject is located) in fuse X.
3. You should see the live preview, you need to place your music in C:\storage\emulated\0\Music to see the music in the live preview
  ![image](https://github.com/PreyK/Nothing-Music-Community/assets/1968543/688af753-98bb-4938-ab09-b294c74cff7b)

4. To build and try it on Android, connect your phone with USB debugging and click Export For Android
   ![image](https://github.com/PreyK/Nothing-Music-Community/assets/1968543/534c8a92-8009-411a-ada4-6757512f0e12)

### Platforms
Pretty much only tested on Nothing Phone (2), layout elements could be off on other screens.

It uses [FuseCloud](https://github.com/fusetools/FuseCloud)'s [Streaming Player](https://github.com/fusetools/FuseCloud/tree/master/StreamingPlayer) with fixes for modern Android systems, it sould work on iOS but you might need to update/rewrite the native code to work on modern iOS versions.

### Brief explanation of the project structure
* [js]() Contains the "frontend/business logic" javascript code.
* [Native]() Contains the native platform specific code for Android, iOS and a dummy for preview
* .UX is the [UX Markup] for the layout

### License
[CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/)
