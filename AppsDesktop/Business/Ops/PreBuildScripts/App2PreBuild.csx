string publishFolder = $@"D:\Temp\Publish";

if(System.IO.Directory.Exists(publishFolder))
{
    System.IO.Directory.Delete(publishFolder, true);
}
System.IO.Directory.CreateDirectory(publishFolder);