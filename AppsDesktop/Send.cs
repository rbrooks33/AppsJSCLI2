using AppsClient;
using RabbitMQ.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AppsDesktop
{
    public class Send
    {
        public static AppsResult Main()
        {
            var result = new AppsResult();
            var factory = new ConnectionFactory() { HostName = "https://localhost:5002" };
            using (var connection = factory.CreateConnection())
            using (var channel = connection.CreateModel())
            {
                channel.QueueDeclare(queue: "hello",
                                     durable: false,
                                     exclusive: false,
                                     autoDelete: false,
                                     arguments: null);

                string message = "Hello World!";
                var body = Encoding.UTF8.GetBytes(message);

                channel.BasicPublish(exchange: "",
                                     routingKey: "hello",
                                     basicProperties: null,
                                     body: body);
                result.SuccessMessages.Add("Sent message: " + message);
            }

            //Console.WriteLine(" Press [enter] to exit.");
            //Console.ReadLine();
            return result;
        }
    }
}
