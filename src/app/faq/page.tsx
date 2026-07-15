import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Le domande più frequenti sul barboncino: alimentazione, salute, toelettatura ed educazione.",
};

const faqs = [
  {
    question: "Quanto vive in media un barboncino?",
    answer:
      "Il barboncino è una delle razze più longeve: le taglie toy e nano vivono generalmente tra i 14 e i 18 anni, mentre le taglie medio e royal tra i 12 e i 15 anni.",
  },
  {
    question: "Il barboncino è davvero ipoallergenico?",
    answer:
      "Nessun cane è completamente ipoallergenico, ma il barboncino produce meno forfora e perde meno pelo rispetto ad altre razze, risultando generalmente più tollerabile per le persone con lievi allergie.",
  },
  {
    question: "Ogni quanto va portato dal toelettatore?",
    answer:
      "Si consiglia un taglio professionale ogni 6-8 settimane, accompagnato da una spazzolatura domestica regolare 2-3 volte a settimana per prevenire nodi e infeltrimenti.",
  },
  {
    question: "Qual è la differenza tra toy e nano?",
    answer:
      "Il toy è la variante più piccola (fino a 28 cm e 1,5-3 kg), mentre il nano è leggermente più grande (28-35 cm e 4-7 kg) e generalmente più robusto.",
  },
  {
    question: "Quanto esercizio fisico serve a un barboncino?",
    answer:
      "Dipende dalla taglia: le taglie piccole necessitano di almeno 30-40 minuti al giorno, mentre le taglie medie e royal richiedono almeno un'ora di attività fisica quotidiana.",
  },
  {
    question: "Il barboncino va d'accordo con i bambini?",
    answer:
      "Sì, generalmente è molto affettuoso e paziente con i bambini, ma è sempre importante supervisionare le interazioni, specialmente con le taglie più piccole e delicate.",
  },
  {
    question: "Quali vaccini sono obbligatori?",
    answer:
      "Il ciclo base include cimurro, epatite infettiva, parvovirosi e leptospirosi, con richiamo antirabbico per chi viaggia. Consulta sempre il tuo veterinario per il calendario personalizzato.",
  },
  {
    question: "Come posso iniziare a usare la dashboard del sito?",
    answer:
      "Registrati gratuitamente tramite la pagina di registrazione, poi accedi alla dashboard per aggiungere il profilo del tuo cane e iniziare a monitorare salute, peso ed eventi.",
  },
];

export default function FaqPage() {
  return (
    <div className="container max-w-3xl py-12">
      <h1 className="mb-2 text-center text-4xl font-bold text-brown-600">Domande frequenti</h1>
      <p className="mb-10 text-center text-brown-500">
        Le risposte alle domande più comuni sul mondo del barboncino
      </p>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <details
            key={idx}
            className="group rounded-lg border border-beige-200 bg-white p-4 dark:bg-brown-700"
          >
            <summary className="cursor-pointer list-none font-medium text-brown-600 marker:content-none">
              <span className="flex items-center justify-between">
                {faq.question}
                <span className="ml-4 text-pink-400 transition-transform group-open:rotate-45">+</span>
              </span>
            </summary>
            <p className="mt-3 text-sm text-brown-500">{faq.answer}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
