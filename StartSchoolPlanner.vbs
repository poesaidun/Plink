Set shell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")

localAppData = shell.ExpandEnvironmentStrings("%LOCALAPPDATA%")
If localAppData = "%LOCALAPPDATA%" Then
  localAppData = shell.ExpandEnvironmentStrings("%USERPROFILE%") & "\AppData\Local"
End If

appDir = localAppData & "\SchoolPlanner"
appUrl = "file:///" & Replace(appDir, "\", "/") & "/index.html"

Set network = CreateObject("WScript.Network")
Set userFile = fso.CreateTextFile(appDir & "\plink-user.js", True)
userFile.WriteLine "window.PLINK_USER = { name: """ & network.UserName & """ };"
userFile.Close

edge = shell.ExpandEnvironmentStrings("%ProgramFiles(x86)%") & "\Microsoft\Edge\Application\msedge.exe"
If Not fso.FileExists(edge) Then
  edge = shell.ExpandEnvironmentStrings("%ProgramFiles%") & "\Microsoft\Edge\Application\msedge.exe"
End If

If fso.FileExists(edge) Then
  shell.Run """" & edge & """ --app=""" & appUrl & """", 0, False
Else
  shell.Run """" & appDir & "\index.html" & """", 1, False
End If
