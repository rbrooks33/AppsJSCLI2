using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AppsDesktop
{
    public static class Command
    {
        public static void Exec(string fileName, string command, Dictionary<string, string> args, string workingDirectory, ref AppsClient.AppsResult outResult)
        {
            var result = new AppsClient.AppsResult();

            try
            {
                var arguments = string.Join(" ", args.Select((k) => string.Format("{0} {1}", k.Key, " " + k.Value + " ")));

                //var projectPath = @"D:\Work\Brooksoft\AppsJS\AppsJSDev\AppsJSDev\AppsJSDev\appsjsdev.csproj"; // @"C:\Users\xyz\Documents\Visual Studio 2017\myConsole\bin\Debug\netcoreapp2.1\myConsole.dll";
                var procStartInfo = new System.Diagnostics.ProcessStartInfo();
                procStartInfo.FileName = fileName;
                procStartInfo.Arguments = @$" {command} {arguments}";
                procStartInfo.UseShellExecute = false;
                procStartInfo.CreateNoWindow = false;
                procStartInfo.RedirectStandardOutput = true;
                procStartInfo.RedirectStandardError = true;
                procStartInfo.WorkingDirectory = workingDirectory;

                var sb = new System.Text.StringBuilder();
                var pr = new System.Diagnostics.Process();
                pr.StartInfo = procStartInfo;

                pr.OutputDataReceived += (s, ev) =>
                {
                    if (string.IsNullOrWhiteSpace(ev.Data))
                    {
                        return;
                    }

                //string[] split = ev.Data.Split(new char[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
                result.SuccessMessages.Add(ev.Data.ToString());
                };

                pr.ErrorDataReceived += (s, err) =>
                {
                    //result.FailMessages.Add("data: " + s.ToString() + ", err: " + err.ToString());
                };

                pr.EnableRaisingEvents = true;

                result.SuccessMessages.Add("files: " + pr.StartInfo.FileName + ", args: " + pr.StartInfo.Arguments);

                pr.Start();
                pr.BeginOutputReadLine();
                pr.BeginErrorReadLine();

                pr.WaitForExit();

                result.Success = true;

                outResult = result;
            }
            catch(System.Exception ex)
            {
                new AppFlows.Helpers.AppsSystem.Exception(ex, ref outResult);
            }
        }
    }
}
