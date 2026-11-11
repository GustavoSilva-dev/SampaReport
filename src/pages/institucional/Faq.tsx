import { Footer } from '../../components/Footer'
import { Header } from '../../components/Header'

const questions = [
  {
    question: 'Como funciona a auditoria dos usuários?',
    answer: 'A auditoria cidadã no SampaReport ocorre em duas fases. Primeiro, através do Filtro Comunitário: um problema só é enviado à prefeitura se receber 5 “upvotes” da vizinhança, evitando chamados falsos. Segundo, através da Validação Final: quando a prefeitura conclui o serviço, ela envia uma foto do “depois”. O cidadão que abriu o chamado audita essa foto e avalia o conserto com uma nota de 0 a 5.',
  },
  {
    question: 'Como publico um chamado na plataforma?',
    answer: 'Basta acessar o Feed do aplicativo, na Visão Cidadão, e clicar em “Novo Report”. Você precisará preencher um título, escolher a categoria, como Asfalto ou Iluminação, apontar a localização exata no mapa e fazer o upload de uma foto do problema. Feito isso, seu chamado entrará no status inicial de “Aguardando Aprovação” da comunidade.',
  },
  {
    question: 'Como sei que meu chamado está sendo atendido?',
    answer: 'O SampaReport possui uma linha do tempo transparente. Você acompanha a mudança de status em tempo real: de “Aguardando Aprovação”, esperando os 5 votos da comunidade, para “Aguardando Homologação”, na fila da prefeitura, passando para “Em Andamento”, quando as equipes estão na rua trabalhando, e finalmente “Em Homologação”, quando a prefeitura devolve o chamado para você avaliar e dar como “Concluído”.',
  },
]

function Faq() {
  return (
    <div className="min-h-screen overflow-hidden font-momo text-zinc-900">
      <Header active="faq" />
      <main>
        <section className="mx-auto max-w-[1240px] px-6 pb-16 pt-16 sm:px-10 sm:pb-24 sm:pt-24">
          <div className="reveal-up max-w-3xl">
            <p className="mb-6 text-[10px] uppercase tracking-[.16em] text-emerald-600">Central de ajuda</p>
            <h1 className="text-[clamp(44px,7vw,82px)] font-medium leading-none tracking-[-.07em] text-[#183c36]">
              Perguntas frequentes<span className="text-emerald-500 animate-pulse
              ">.</span>
            </h1>
            <p className="mt-8 max-w-2xl text-sm leading-7 text-zinc-600 sm:text-base">
              Entenda como o SampaReport transforma a participação da comunidade em melhorias para a cidade.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-[900px] px-6 pb-20 sm:px-10 sm:pb-28" aria-label="Perguntas frequentes">
          <div className="space-y-2">
            {questions.map((item, index) => (
              <details
                className={`reveal-up reveal-delay-${index + 1} group border-t bg-gray-50 px-5 rounded-xl border-emerald-500 py-6 last:border-b`}
                key={item.question}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-base font-medium text-zinc-900 transition-colors hover:text-emerald-600 sm:text-lg [&::-webkit-details-marker]:hidden">
                  <span>{item.question}</span>
                  <span className="faq-chevron shrink-0 text-2xl font-light leading-none text-emerald-500 transition-transform duration-300 group-open:rotate-45" aria-hidden="true">+</span>
                </summary>
                <p className="max-w-3xl pt-5 text-sm leading-7 text-zinc-600 sm:pr-16">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default Faq
