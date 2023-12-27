using Fuse;
using Fuse.Scripting;
using Uno.UX;
using Uno.Compiler.ExportTargetInterop;

[UXGlobalModule]
public class MetadataQueryModule : NativeModule
{
    static readonly MetadataQueryModule _instance;
    
    public MetadataQueryModule()
    {
        // Make sure we're only initializing the module once
        if (_instance != null) return;

        _instance = this;
        Resource.SetGlobalKey(_instance, "MetadataQueryModule");
        AddMember(new NativeFunction("Log", (NativeCallback)Log));
        AddMember(new NativeFunction("QueryTrackName", (NativeCallback)QueryTrackName));
        AddMember(new NativeFunction("QueryTrackArtist", (NativeCallback)QueryTrackArtist));
    }

    static object QueryTrackName(Context c, object[] args){
        string name="trackname";
        foreach (var arg in args){
            if defined(Android)
			{
				name = (string)QueryTrackNameImpl((string)arg);
			}
        }
        return name;
    }
    static object QueryTrackArtist(Context c, object[] args){
        string artist="artist";
        foreach (var arg in args){
            if defined(Android)
			{
				artist = (string)QueryArtistImpl((string)arg);
			}
        }
        return artist;
    }

    [Foreign(Language.Java)]
    public static extern(Android) string QueryTrackNameImpl(string path)
    @{
        //this is sketchy, do not do this, make a .java class and use imports for native stuff
        android.media.MediaMetadataRetriever ret = new android.media.MediaMetadataRetriever();
        ret.setDataSource(path);
        String name = ret.extractMetadata(android.media.MediaMetadataRetriever.METADATA_KEY_TITLE);
        return name;
    @}
    [Foreign(Language.Java)]
    public static extern(Android) string QueryArtistImpl(string path)
    @{
        //this is sketchy, do not do this, make a .java class and use imports for native stuff
        android.media.MediaMetadataRetriever ret = new android.media.MediaMetadataRetriever();
        ret.setDataSource(path);
        String name = ret.extractMetadata(android.media.MediaMetadataRetriever.METADATA_KEY_ARTIST);
        return name;
    @}


    static object Log(Context c, object[] args)
    {
        foreach (var arg in args)
            debug_log arg;

        return "hello there";
    }
}