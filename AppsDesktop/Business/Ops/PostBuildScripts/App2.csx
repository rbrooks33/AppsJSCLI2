DateTime today = DateTime.Now;
string destinationFolder = $@"D:\Temp\Published_{today.Year.ToString()}_{today.Month.ToString()}_{today.Day.ToString()}";

if(System.IO.Directory.Exists(destinationFolder))
{
    System.IO.Directory.Delete(destinationFolder);
}
System.IO.Directory.Move(@"D:\Temp\service 2 deploy", destinationFolder);