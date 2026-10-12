console.log("Portfolio de Titouan Genève chargé avec succès.");

const btnTop = document.getElementById('back-to-top');

if (btnTop) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      btnTop.classList.add('show');
    } else {
      btnTop.classList.remove('show');
    }
  });

  btnTop.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

if (window.particlesJS && document.getElementById('particles-js')) {
  window.particlesJS('particles-js', {
    "particles": {
      "number": {
        "value": 80,
        "density": {
          "enable": true,
          "value_area": 800
        }
      },
      "color": {
        "value": "#178F85"
      },
      "shape": {
        "type": "circle",
        "stroke": {
          "width": 0,
          "color": "#000000"
        }
      },
      "opacity": {
        "value": 0.6,
        "random": true,
        "anim": {
          "enable": true,
          "speed": 1,
          "opacity_min": 0.3,
          "sync": false
        }
      },
      "size": {
        "value": 5,
        "random": true,
        "anim": {
          "enable": true,
          "speed": 6,
          "size_min": 1,
          "sync": false
        }
      },
      "line_linked": {
        "enable": true,
        "distance": 150,
        "color": "#38BDF8",
        "opacity": 0.3,
        "width": 1
      },
      "move": {
        "enable": true,
        "speed": 3,
        "direction": "none",
        "random": false,
        "straight": false,
        "out_mode": "out",
        "bounce": false,
        "attract": {
          "enable": false,
          "rotateX": 600,
          "rotateY": 1200
        }
      }
    },
    "interactivity": {
      "detect_on": "canvas",
      "events": {
        "onhover": {
          "enable": true,
          "mode": "grab"
        },
        "onclick": {
          "enable": true,
          "mode": "push"
        },
        "resize": true
      },
      "modes": {
        "grab": {
          "distance": 120,
          "line_linked": {
            "opacity": 0.4
          }
        },
        "bubble": {
          "distance": 200,
          "size": 8,
          "duration": 2,
          "opacity": 0.8,
          "speed": 3
        },
        "repulse": {
          "distance": 100,
          "duration": 0.4
        },
        "push": {
          "particles_nb": 4
        },
        "remove": {
          "particles_nb": 2
        }
      }
    },
    "retina_detect": true
  });
}

const openMenuBtn = document.getElementById('openMenu');
const closeMenuBtn = document.getElementById('closeMenu');
const sidebar = document.getElementById('sidebar');

if (openMenuBtn && closeMenuBtn && sidebar) {
  openMenuBtn.addEventListener('click', () => {
    sidebar.classList.add('active');
    openMenuBtn.classList.add('hidden');
  });

  closeMenuBtn.addEventListener('click', () => {
    sidebar.classList.remove('active');
    openMenuBtn.classList.remove('hidden');
  });
}

const USER = "TitouanGeneve";
const MONTHS = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];

// 1. Nombre de dépôts publics (API officielle GitHub)
async function loadRepos() {
  const el = document.getElementById("repo-count");
  try {
    const res = await fetch(`https://api.github.com/users/${USER}`);
    if (!res.ok) throw new Error(res.status);
    const data = await res.json();
    el.textContent = data.public_repos;
  } catch (e) {
    el.textContent = "indisponible";
  }
}

// 2. Graphique des contributions (API publique tierce, sans token)
async function loadContributions() {
  const status = document.getElementById("graph-status");
  try {
    const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${USER}?y=last`);
    if (!res.ok) throw new Error(res.status);
    const data = await res.json();
    const days = data.contributions;
    if (!days || !days.length) throw new Error("vide");

    const grid = document.getElementById("grid");
    const months = document.getElementById("months");

    // Décalage pour aligner le premier jour sur sa ligne (lundi = 0)
    const firstDow = (new Date(days[0].date + "T00:00:00").getDay() + 6) % 7;
    for (let i = 0; i < firstDow; i++) {
      const pad = document.createElement("div");
      pad.className = "cell empty";
      grid.appendChild(pad);
    }

    let total = 0;
    days.forEach((d, i) => {
      total += d.count;
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.level = d.level;
      const date = new Date(d.date + "T00:00:00").toLocaleDateString("fr-FR", {
        day: "numeric", month: "long", year: "numeric"
      });
      cell.title = `${d.count} contribution${d.count > 1 ? "s" : ""} le ${date}`;
      grid.appendChild(cell);
    });

    // Étiquettes des mois (une par colonne de début de mois)
    const totalCols = Math.ceil((days.length + firstDow) / 7);
    let lastMonth = -1;
    for (let col = 0; col < totalCols; col++) {
      const idx = col * 7 - firstDow;
      const day = days[Math.max(idx, 0)];
      const m = new Date(day.date + "T00:00:00").getMonth();
      const span = document.createElement("span");
      if (m !== lastMonth && (col > 0 || idx >= 0)) {
        span.textContent = MONTHS[m];
        lastMonth = m;
      }
      months.appendChild(span);
    }

    document.getElementById("contrib-total").textContent =
      (data.total && data.total.lastYear) ?? total;

    status.hidden = true;
    document.getElementById("graph-wrap").hidden = false;
    document.getElementById("legend").hidden = false;
  } catch (e) {
    status.textContent = "Impossible de charger le graphique de contributions pour le moment.";
    status.classList.add("error");
    document.getElementById("contrib-total").textContent = "indisponible";
  }
}

loadRepos();
loadContributions();