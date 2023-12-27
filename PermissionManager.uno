using Fuse;
using Fuse.Scripting;
using Uno.UX;
using Uno;
using Fuse.Android.Permissions;

[UXGlobalModule]
public class PermissionManager : NativeEventEmitterModule
{
    static readonly  PermissionManager _instance;
    
    public PermissionManager() : base(true, "onPermissionRecieved")
    {
        // Make sure we're only initializing the module once
        if (_instance != null) return;

        _instance = this;
        Resource.SetGlobalKey(_instance, "PermissionManager");
        AddMember(new NativeFunction("RequestPermissions", (NativeCallback)RequestPermissions));
    }

     object RequestPermissions(Context c, object[] args)
    {
        //debug_log("gonna request permissions now");
        RequestAndroidPermission();
        return null;
    }
    public  extern (Preview) void RequestAndroidPermission(){
        Emit("onPermissionRecieved", "yey");
    }
    public  extern (Android) void RequestAndroidPermission(){
        PlatformPermission[] myIntArray = new PlatformPermission[4] 
        { Permissions.Android.READ_MEDIA_AUDIO,
        Permissions.Android.READ_EXTERNAL_STORAGE,
         Permissions.Android.POST_NOTIFICATIONS,
         Permissions.Android.WRITE_EXTERNAL_STORAGE
        };
       var permissionPromise = Permissions.Request(myIntArray); // [0]
        permissionPromise.Then(OnPermitted, OnRejected); // [1]
    }


    public extern (Android) void OnPermitted(PlatformPermission[] permission)
    {
        foreach(var perm in permission){
        debug_log perm;
        }
        Emit("onPermissionRecieved", "yey");
    }
    public extern (Android) void OnRejected(Exception e)
    {
        debug_log "Blast: " + e;
    }
}