const STORAGE_KEYS = {
  COMPLETED_MISSIONS: 'gina_completed_missions',
  BADGES: 'gina_earned_badges',
  SIM_RESULT: 'gina_last_sim_result'
};

const ALL_BADGES = [
  { id: 'data_detective', mission: 1, name: 'DATA DETECTIVE', desc: 'Membaca data tabel & rasio penyaringan darah' },
  { id: 'signal_decoder', mission: 2, name: 'SIGNAL DECODER', desc: 'Mengelompokkan data & membaca diagram batang' },
  { id: 'number_master', mission: 3, name: 'NUMBER MASTER', desc: 'Menguasai perkalian & penjumlahan bobot risiko' },
  { id: 'fuzzy_explorer', mission: 4, name: 'FUZZY EXPLORER', desc: 'Memahami skala interval & logika fuzzy' },
  { id: 'pattern_hunter', mission: 5, name: 'PATTERN HUNTER', desc: 'Mencari modus & membaca pola kebiasaan' },
  { id: 'super_detective', mission: 6, name: 'GINA\'S SUPER DETECTIVE', desc: 'Menuntaskan seluruh 6 misi penyelamatan' }
];

class SoundFX {
  static playPop() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {}
  }

  static playSuccess() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const now = ctx.currentTime;

      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.value = freq;

        gain.gain.setValueAtTime(0.15, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(
          0.001,
          now + i * 0.08 + 0.25
        );

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.25);
      });
    } catch (e) {}
  }
}

function getCompletedMissions() {
  try {
    const data = localStorage.getItem(
      STORAGE_KEYS.COMPLETED_MISSIONS
    );

    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

function saveCompletedMission(missionId) {
  const completed = getCompletedMissions();

  if (!completed.includes(missionId)) {
    completed.push(missionId);

    localStorage.setItem(
      STORAGE_KEYS.COMPLETED_MISSIONS,
      JSON.stringify(completed)
    );
  }

  updateGlobalProgressUI();
}

function isMissionCompleted(missionId) {
  return getCompletedMissions().includes(missionId);
}

function resetProgress() {
  if (
    confirm(
      "Detektif Muda, apakah kamu ingin mengulang petualangan dari awal? Semua lencana akan direset."
    )
  ) {
    localStorage.removeItem(
      STORAGE_KEYS.COMPLETED_MISSIONS
    );

    localStorage.removeItem(
      STORAGE_KEYS.BADGES
    );

    localStorage.removeItem(
      STORAGE_KEYS.SIM_RESULT
    );

    updateGlobalProgressUI();
    window.location.reload();
  }
}

function updateGlobalProgressUI() {
  const completed = getCompletedMissions();
  const count = completed.length;
  const percent = Math.round((count / 6) * 100);

  const navBadge =
    document.getElementById('navProgressBadge');

  if (navBadge) {
    navBadge.innerHTML =
      `${count}/6 Misi Selesai`;
  }

  const progressText =
    document.getElementById('progressText');

  const progressFill =
    document.getElementById('progressFill');

  const progressPercent =
    document.getElementById('progressPercent');

  if (progressText) {
    progressText.innerText =
      `${count} / 6 Misi Selesai`;
  }

  if (progressFill) {
    progressFill.style.width =
      `${percent}%`;
  }

  if (progressPercent) {
    progressPercent.innerText =
      `${percent}% Selesai`;
  }

  ALL_BADGES.forEach(b => {
    const el =
      document.getElementById(
        `badge-showcase-${b.id}`
      );

    if (el) {
      if (completed.includes(b.mission)) {
        el.classList.add('unlocked');
      } else {
        el.classList.remove('unlocked');
      }
    }
  });

  for (let i = 1; i <= 6; i++) {
    const card =
      document.getElementById(
        `checkpoint-card-${i}`
      );

    const statusText =
      document.getElementById(
        `checkpoint-status-${i}`
      );

    const btn =
      document.getElementById(
        `checkpoint-btn-${i}`
      );

    if (card) {
      if (completed.includes(i)) {
        card.classList.add('completed');

        if (statusText) {
          statusText.innerHTML =
            '<span style="color:#2ED573; font-weight:700;">Selesai</span>';
        }

        if (btn) {
          btn.innerText = 'Ulangi Misi';
        }
      } else {
        card.classList.remove('completed');

        if (statusText) {
          statusText.innerHTML =
            '<span style="color:var(--color-navy-medium);">Siap Dijalankan</span>';
        }

        if (btn) {
          btn.innerText = 'Mulai Misi';
        }
      }
    }
  }
}

function showBadgeModal(
  badgeName,
  badgeIcon,
  badgeDesc,
  nextMissionUrl
) {
  SoundFX.playSuccess();

  const overlay =
    document.getElementById(
      'badgeModalOverlay'
    );

  if (!overlay) return;

  const iconEl =
    document.getElementById(
      'modalBadgeIcon'
    );

  if (iconEl) {
    iconEl.innerText = '';
  }

  document.getElementById(
    'modalBadgeName'
  ).innerText = badgeName;

  document.getElementById(
    'modalBadgeDesc'
  ).innerText = badgeDesc;

  const nextBtn =
    document.getElementById(
      'modalNextBtn'
    );

  if (nextBtn) {
    if (nextMissionUrl) {
      nextBtn.onclick = () => {
        window.location.href =
          nextMissionUrl;
      };

      nextBtn.innerText =
        "Lanjut ke Misi Berikutnya";

      nextBtn.style.display =
        "inline-flex";
    } else {
      nextBtn.onclick = () => {
        window.location.href =
          '/petualangan';
      };

      nextBtn.innerText =
        "Kembali ke Peta Petualangan";

      nextBtn.style.display =
        "inline-flex";
    }
  }

  overlay.classList.add('active');
}

function closeBadgeModal() {
  const overlay =
    document.getElementById(
      'badgeModalOverlay'
    );

  if (overlay) {
    overlay.classList.remove('active');
  }
}

function initTypewriter(
  text,
  elementId,
  speed = 25
) {
  const el =
    document.getElementById(elementId);

  if (!el) return;

  el.innerHTML = '';

  let i = 0;

  function type() {
    if (i < text.length) {
      el.innerHTML =
        text.substring(0, i + 1) +
        '<span class="typing-cursor"></span>';

      i++;

      setTimeout(type, speed);
    } else {
      el.innerHTML = text;
    }
  }

  type();
}

document.addEventListener(
  'DOMContentLoaded',
  () => {
    const hamburger =
      document.getElementById(
        'hamburgerBtn'
      );

    const navLinks =
      document.getElementById(
        'navLinks'
      );

    if (hamburger && navLinks) {
      hamburger.addEventListener(
        'click',
        () => {
          hamburger.classList.toggle(
            'open'
          );

          navLinks.classList.toggle(
            'open'
          );
        }
      );

      navLinks
        .querySelectorAll('a')
        .forEach(link => {
          link.addEventListener(
            'click',
            () => {
              hamburger.classList.remove(
                'open'
              );

              navLinks.classList.remove(
                'open'
              );
            }
          );
        });
    }

    const navbar =
      document.querySelector(
        '.navbar'
      );

    window.addEventListener(
      'scroll',
      () => {
        if (window.scrollY > 30) {
          navbar?.classList.add(
            'scrolled'
          );
        } else {
          navbar?.classList.remove(
            'scrolled'
          );
        }
      }
    );

    updateGlobalProgressUI();

    const resetBtn =
      document.getElementById(
        'btnResetProgress'
      );

    if (resetBtn) {
      resetBtn.addEventListener(
        'click',
        resetProgress
      );
    }
  }
);

function initMission1Activity() {
  const slider =
    document.getElementById(
      'bloodSlider'
    );

  const bloodVal =
    document.getElementById(
      'bloodValDisplay'
    );

  const ratioVal =
    document.getElementById(
      'ratioValDisplay'
    );

  const bottlesCount =
    document.getElementById(
      'bottlesCountDisplay'
    );

  if (!slider) return;

  function update() {
    const blood =
      parseFloat(slider.value);

    const urine = 1.5;

    const ratio =
      Math.round(
        blood / urine
      );

    if (bloodVal) {
      bloodVal.innerText =
        `${blood} Liter`;
    }

    if (ratioVal) {
      ratioVal.innerText =
        `${ratio} Kali Lipat`;
    }

    if (bottlesCount) {
      bottlesCount.innerText =
        `Setara ${ratio} botol air kemasan 1,5L!`;
    }

    SoundFX.playPop();
  }

  slider.addEventListener(
    'input',
    update
  );
}

let mission2Data = {
  'Kurang Minum': 8,
  'Tahan Pipis': 6,
  'Urine Pekat': 4,
  'Cepat Lelah': 2
};

function initMission2Activity() {
  renderMission2Chart();
}

function addSignalCount(signalName) {
  if (
    mission2Data[signalName] !==
    undefined
  ) {
    mission2Data[signalName] += 1;

    renderMission2Chart();

    SoundFX.playPop();
  }
}

function renderMission2Chart() {
  const container =
    document.getElementById(
      'barChartColumns'
    );

  if (!container) return;

  const maxVal =
    Math.max(
      ...Object.values(
        mission2Data
      ),
      10
    );

  container.innerHTML = '';

  Object.entries(
    mission2Data
  ).forEach(
    ([label, count]) => {
      const heightPercent =
        Math.min(
          100,
          Math.round(
            (count / maxVal) * 90
          )
        );

      const col =
        document.createElement(
          'div'
        );

      col.className =
        'bar-column';

      col.innerHTML = `
        <div class="bar-fill" style="height: ${heightPercent}%">${count}</div>
        <div class="bar-label">${label}</div>
      `;

      container.appendChild(col);
    }
  );
}

let selectedSymptoms = {
  s1: {
    name: 'Urine Sangat Pekat / Keruh',
    weight: 3,
    checked: false
  },

  s2: {
    name: 'Pegal di Pinggang Belakang',
    weight: 2,
    checked: false
  },

  s3: {
    name: 'Rasa Haus & Kurang Minum',
    weight: 1,
    checked: false
  }
};

function toggleSymptom(key) {
  if (selectedSymptoms[key]) {
    selectedSymptoms[key].checked =
      !selectedSymptoms[key].checked;

    SoundFX.playPop();

    renderMission3Calc();
  }
}

function renderMission3Calc() {
  const container =
    document.getElementById(
      'symptomsToggleList'
    );

  if (!container) return;

  container.innerHTML = '';

  let totalScore = 0;
  let formulaParts = [];

  Object.entries(
    selectedSymptoms
  ).forEach(
    ([k, item]) => {
      const isChecked =
        item.checked;

      const value =
        isChecked ? 1 : 0;

      const subtotal =
        value * item.weight;

      totalScore += subtotal;

      formulaParts.push(
        `(${item.weight} × ${value})`
      );

      const div =
        document.createElement(
          'div'
        );

      div.className =
        `symptom-toggle-item ${
          isChecked ? 'checked' : ''
        }`;

      div.onclick = () =>
        toggleSymptom(k);

      div.innerHTML = `
        <div>
          <strong>${item.name}</strong>
          <div style="font-size:0.8rem; color:var(--color-navy-medium);">
            Bobot Risiko: ${item.weight}
          </div>
        </div>

        <div style="
          width:24px;
          height:24px;
          border:2px solid ${
            isChecked
              ? 'var(--color-blue)'
              : 'var(--color-navy-soft)'
          };
          border-radius:4px;
          display:flex;
          align-items:center;
          justify-content:center;
          background:${
            isChecked
              ? 'var(--color-blue)'
              : 'transparent'
          };
          color:#fff;
        ">
          ${
            isChecked
              ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>'
              : ''
          }
        </div>
      `;

      container.appendChild(div);
    }
  );

  const formulaSteps =
    document.getElementById(
      'mathFormulaSteps'
    );

  const formulaTotal =
    document.getElementById(
      'mathFormulaTotal'
    );

  if (formulaSteps) {
    formulaSteps.innerText =
      formulaParts.join(' + ');
  }

  if (formulaTotal) {
    formulaTotal.innerText =
      totalScore;
  }
}

function fuzzyTrapmf(
  value,
  a,
  b,
  c,
  d
) {
  if (value <= a) {
    return 0;
  }

  if (value >= d) {
    return 0;
  }

  if (value >= b && value <= c) {
    return 1;
  }

  if (value > a && value < b) {
    return (
      (value - a) /
      (b - a)
    );
  }

  if (value > c && value < d) {
    return (
      (d - value) /
      (d - c)
    );
  }

  return 0;
}

function fuzzyTrimf(
  value,
  a,
  b,
  c
) {
  if (
    value <= a ||
    value >= c
  ) {
    return 0;
  }

  if (value === b) {
    return 1;
  }

  if (value < b) {
    return (
      (value - a) /
      (b - a)
    );
  }

  return (
    (c - value) /
    (c - b)
  );
}

function calculateMission4Fuzzy(
  score
) {
  const rendah =
    fuzzyTrapmf(
      score,
      0,
      0,
      30,
      45
    );

  const sedang =
    fuzzyTrimf(
      score,
      35,
      50,
      65
    );

  const tinggi =
    fuzzyTrapmf(
      score,
      55,
      70,
      100,
      100
    );

  const total =
    rendah +
    sedang +
    tinggi;

  let fuzzyScore = score;

  if (total > 0) {
    fuzzyScore =
      (
        rendah * 22.5 +
        sedang * 50 +
        tinggi * 77.5
      ) / total;
  }

  let category;

  if (fuzzyScore < 40) {
    category = 'Rendah';
  } else if (fuzzyScore < 60) {
    category = 'Sedang';
  } else {
    category = 'Tinggi';
  }

  return {
    score: Number(
      fuzzyScore.toFixed(2)
    ),
    category,
    memberships: {
      rendah: Number(
        rendah.toFixed(3)
      ),
      sedang: Number(
        sedang.toFixed(3)
      ),
      tinggi: Number(
        tinggi.toFixed(3)
      )
    }
  };
}

function initMission4Activity() {
  const slider =
    document.getElementById(
      'fuzzyRangeSlider'
    );

  const scoreDisplay =
    document.getElementById(
      'fuzzyScoreDisplay'
    );

  const statusCard =
    document.getElementById(
      'fuzzyStatusCard'
    );

  const statusLabel =
    document.getElementById(
      'fuzzyStatusLabel'
    );

  const statusDesc =
    document.getElementById(
      'fuzzyStatusDesc'
    );

  if (!slider) return;

  function update() {
    const value =
      parseInt(
        slider.value,
        10
      );

    const result =
      calculateMission4Fuzzy(
        value
      );

    if (scoreDisplay) {
      scoreDisplay.innerText =
        value;
    }

    if (statusCard) {
      statusCard.className =
        'fuzzy-status-card';

      if (
        result.category ===
        'Rendah'
      ) {
        statusCard.classList.add(
          'low'
        );
      } else if (
        result.category ===
        'Sedang'
      ) {
        statusCard.classList.add(
          'medium'
        );
      } else {
        statusCard.classList.add(
          'high'
        );
      }
    }

    if (statusLabel) {
      statusLabel.innerHTML =
        `Kategori: Risiko ${result.category}`;
    }

    if (statusDesc) {
      statusDesc.innerText =
        `Derajat keanggotaan — Rendah: ${result.memberships.rendah} | Sedang: ${result.memberships.sedang} | Tinggi: ${result.memberships.tinggi}.`;
    }
  }

  slider.addEventListener(
    'input',
    update
  );

  update();
}

let modeSelected = null;

function checkModeChoice(
  choice,
  isCorrect
) {
  SoundFX.playPop();

  const feedback =
    document.getElementById(
      'modeFinderFeedback'
    );

  const items =
    document.querySelectorAll(
      '.mode-item-card'
    );

  items.forEach(
    el =>
      el.classList.remove(
        'selected'
      )
  );

  const clickedEl =
    document.getElementById(
      `mode-item-${choice}`
    );

  if (clickedEl) {
    clickedEl.classList.add(
      'selected'
    );
  }

  if (isCorrect) {
    SoundFX.playSuccess();

    if (feedback) {
      feedback.style.display =
        'block';

      feedback.className =
        'quiz-feedback-box show';

      feedback.style.backgroundColor =
        'rgba(46, 213, 115, 0.15)';

      feedback.style.color =
        '#0d6332';

      feedback.innerHTML =
        `<strong>Tepat Sekali!</strong> 4 Gelas muncul sebanyak 3 kali (terbanyak), sehingga 4 Gelas adalah <strong>MODUS</strong> dari data ini.`;
    }
  } else {
    if (feedback) {
      feedback.style.display =
        'block';

      feedback.className =
        'quiz-feedback-box show';

      feedback.style.backgroundColor =
        'var(--color-red-tint)';

      feedback.style.color =
        'var(--color-red)';

      feedback.innerHTML =
        `<strong>Belum Tepat!</strong> Hitung kembali item mana yang paling sering muncul di catatan harian.`;
    }
  }
}

function completeCapstoneStep(
  step
) {
  SoundFX.playSuccess();

  const stepBox =
    document.getElementById(
      `capstone-step-${step}`
    );

  const nextBox =
    document.getElementById(
      `capstone-step-${step + 1}`
    );

  if (stepBox) {
    stepBox.style.opacity =
      '0.7';

    const btn =
      stepBox.querySelector(
        'button'
      );

    if (btn) {
      btn.innerText =
        'Terverifikasi';

      btn.disabled = true;
    }
  }

  if (nextBox) {
    nextBox.style.display =
      'block';

    nextBox.scrollIntoView({
      behavior: 'smooth'
    });
  }
}

function checkChallengeAnswer(
  selectedIndex,
  correctIndex,
  explanation,
  missionId,
  badgeId,
  badgeName,
  badgeIcon,
  nextUrl
) {
  const options =
    document.querySelectorAll(
      '.quiz-option-btn'
    );

  const feedbackBox =
    document.getElementById(
      'quizFeedbackBox'
    );

  const claimBtn =
    document.getElementById(
      'claimBadgeBtn'
    );

  options.forEach(
    (opt, idx) => {
      opt.disabled = true;

      if (
        idx === correctIndex
      ) {
        opt.classList.add(
          'selected-correct'
        );
      } else if (
        idx === selectedIndex
      ) {
        opt.classList.add(
          'selected-wrong'
        );
      }
    }
  );

  if (
    selectedIndex ===
    correctIndex
  ) {
    SoundFX.playSuccess();

    feedbackBox.style.display =
      'block';

    feedbackBox.className =
      'quiz-feedback-box show';

    feedbackBox.style.backgroundColor =
      'rgba(46, 213, 115, 0.15)';

    feedbackBox.style.color =
      '#0d6332';

    feedbackBox.innerHTML =
      `<strong>Luar Biasa, Detektif Muda!</strong><br>${explanation}`;

    if (claimBtn) {
      claimBtn.style.display =
        'inline-flex';

      claimBtn.onclick = () => {
        saveCompletedMission(
          missionId
        );

        showBadgeModal(
          badgeName,
          '',
          `Selamat! Kamu telah menyelesaikan Misi ${missionId} dan memperoleh lencana ${badgeName}!`,
          nextUrl
        );
      };
    }
  } else {
    feedbackBox.style.display =
      'block';

    feedbackBox.className =
      'quiz-feedback-box show';

    feedbackBox.style.backgroundColor =
      'var(--color-red-tint)';

    feedbackBox.style.color =
      'var(--color-red)';

    feedbackBox.innerHTML =
      `<strong>Coba selidiki lagi:</strong><br>Jawaban yang paling tepat adalah pilihan yang berwarna hijau. Baca pembahasannya: ${explanation}`;

    if (claimBtn) {
      claimBtn.style.display =
        'inline-flex';

      claimBtn.innerText =
        'Pahami & Ambil Lencana';

      claimBtn.onclick = () => {
        saveCompletedMission(
          missionId
        );

        showBadgeModal(
          badgeName,
          '',
          `Terus berlatih! Kamu telah menyelesaikan Misi ${missionId} dan memperoleh lencana ${badgeName}!`,
          nextUrl
        );
      };
    }
  }
}