import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { VacantsCard } from "@vacants/components/vacants-card/vacants-card.component";
import { Card } from '@vacants/interfaces/card.interface';

@Component({
  selector: 'app-vacants-page',
  imports: [VacantsCard],
  templateUrl: './vacants-page.html'
})
export class VacantsPage {
  cards = signal<Card[]>([
    {
        Title: "Senior Frontend Dev",
        State: "¡Nuevo!",
        Description: "TechCorp S.A. • Remoto",
        Tecnologies: ["React"]
    },
    {
        Title: "Backend Developer",
        State: "Activo",
        Description: "SoftSolutions • Santo Domingo",
        Tecnologies: ["C#", ".NET", "SQL"]
    },
    {
        Title: "Fullstack Engineer",
        State: "Urgente",
        Description: "Innovatech • Remoto",
        Tecnologies: ["Angular", "Node", "MongoDB"]
    },
    {
        Title: "Junior Frontend",
        State: "Nuevo",
        Description: "WebStudio • Híbrido",
        Tecnologies: ["HTML", "CSS", "JS"]
    },
    {
        Title: "Senior .NET Dev",
        State: "Activo",
        Description: "EnterpriseDev • Presencial",
        Tecnologies: [".NET", "SQL Server"]
    },
    {
        Title: "React Developer",
        State: "Nuevo",
        Description: "StartupX • Remoto",
        Tecnologies: ["React", "TypeScript"]
    },
    {
        Title: "DevOps Engineer",
        State: "Urgente",
        Description: "CloudNet • Remoto",
        Tecnologies: ["Docker", "Azure", "CI/CD"]
    },
    {
        Title: "QA Tester",
        State: "Activo",
        Description: "QualitySoft • Híbrido",
        Tecnologies: ["Selenium", "Cypress"]
    },
    {
        Title: "UI Designer",
        State: "Nuevo",
        Description: "CreativeApps • Remoto",
        Tecnologies: ["Figma", "CSS"]
    },
    {
        Title: "Data Analyst",
        State: "Activo",
        Description: "DataCorp • Presencial",
        Tecnologies: ["Python", "SQL", "PowerBI"]
    },
    {
        Title: "Mobile Developer",
        State: "Nuevo",
        Description: "AppWorks • Remoto",
        Tecnologies: ["Flutter", "Dart"]
    }
  ]);
 }
