import Image from "next/image";

export function GlobalHealthFocus() {
  return (
    <section className="bg-secondary">
      <div className="container">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
          <div className="order-2 md:order-1">
            <div className="space-y-4">
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg shadow-lg">
                <Image
                  src="/images/global-health.jpeg"
                  alt="Global health technology network visualization"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg shadow-lg">
                <Image
                  src="/images/earth-2.png"
                  alt="Technology embedded futuristic earth from space"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <h2 className="font-headline text-5xl text-primary-950 font-bold tracking-tight">
              Research & Experience
            </h2>
            <p className="mt-6 text-lg text-muted-foreground">
              Applied data scientist and global health researcher building AI systems 
              to address health misinformation and advance digital equity.
            </p>
            <div className="mt-6 space-y-4">
              <div className="bg-accent-50 rounded-lg p-5 border-l-4 border-accent-600">
                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent-600"></span>
                  Current Focus
                </h3>
                <p className="text-muted-foreground">
                  Integrating crisis informatics, health data science, and applied AI
                  to create next-generation intelligence for health resilience. Translating
                  research into deployed systems and training the next generation of health informatics leaders.
                </p>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-accent-600 font-semibold">→</span>
                    <span><strong>MedContext:</strong> Agentic AI for medical misinformation detection—91.4% accuracy across multimodal sources</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent-600 font-semibold">→</span>
                    <span><strong>Trust Defense:</strong> Real-time AI platform for detecting and responding to threats against institutional trust</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-4">
                  Previous Experience
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 rounded-lg bg-secondary-100 border-l-4 border-l-primary-600 shadow-sm">
                    <div className="w-3 h-3 rounded-full bg-primary-600 mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="font-semibold text-base text-foreground">
                        Chief Partnerships Officer, Purpose Life Sciences
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Executive Director of the TOGETHER Adaptive Platform Trial Consortium
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 rounded-lg bg-secondary-100 border-l-4 border-l-accent-600 shadow-sm">
                    <div className="w-3 h-3 rounded-full bg-accent-600 mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="font-semibold text-base text-foreground">
                        Managing Director, MTEK Sciences East Africa
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Advisor to Ministry of Health of Rwanda, Data Science
                        for Decision-making
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 rounded-lg bg-secondary-100 border-l-4 border-l-jungle-600 shadow-sm">
                    <div className="w-3 h-3 rounded-full bg-jungle-600 mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="font-semibold text-base text-foreground">
                        Research & Strategy Lead, Purpose Africa
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Developing pan-African clinical research capacity
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 rounded-lg bg-secondary-100 border-l-4 border-l-eggplant-600 shadow-sm">
                    <div className="w-3 h-3 rounded-full bg-eggplant-600 mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="font-semibold text-base text-foreground">
                        Scientific Director
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        African AI Innovation Ecosystem Research Network
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
