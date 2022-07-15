# Função Lambda que starta e stopa mas maquinas do tipo EC2.
Este é um projeto lambda feito com Serverless framework, configuranda com triger de evento schedule.

## Como rodar e testar

Para rodar e testar este lambda

1.Abra o terminal

2.Clone o projeto
```bash
#git clone
git clone https://github.com/silveiratalita/start-stop-ec2-lambda.git

```

3.Rode o comando npm i para instalar as dependencias do projeto. Na raiz do projeto rode npm run dev ou yarn dev, conforme abaixo.

```bash
# npm
npm run dev

# yarn
yarn dev
```
Para testar é possível usar o exemplo de evento a seguir.
```json
{
  "id": "53dc4d37-cffa-4f76-80c9-8b7d4a4d2eaa",
  "detail-type": "Scheduled Event",
  "source": "aws.events",
  "account":"123456789012",
  "time": "2019-10-08T16:53:06Z",
  "region": "us-east-1",
  "resources": ["arn:aws:events:us-east-1:123456789012:rule/MyScheduledRule"],
  "action": "Stop",
  "msg": "Estamos ligando as maquinas do ambiente de dev",
  "detail": {

  },
}
```

## Como usar e deployar

Para trabalhar no peojeto basta testar utilizando o9 arquivo indez e enviando o evento acima, alterando start e stop, e chamando a função handler.
Ternha certeza que teu aws cli está configurado com tuas key e secret para que a lib aws sdk consiga chamar a API da AWS.

Para alterra a função basta fazer o deploy utilizando o comando a serverless deploy na raiz do projeto.
```bash
serverless deploy
```
Após isso cheque as instancias e os logs do lambda.


# Explicação

O Lambda visa parar as maquinas e iniciadas em determinados horários, com a finalidade de diminuir custos de infra no ambiente de dev.

### Documentações

As documentações utilizadas para a construção do projeto foram as seguintes:
- https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/EventTypes.html
- https://docs.aws.amazon.com/code-samples/latest/catalog/javascript-ec2-ec2_startstopinstances.js.html
- https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-create-rule-schedule.html
- https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/RunLambdaSchedule.html
- https://www.serverless.com/framework/docs/providers/aws/events/schedule
- https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeInstances.html
- https://crontab.guru/
