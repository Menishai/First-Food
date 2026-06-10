import { Profile, FoodItem, Status } from '../types';

export const exportBackupJSON = (profiles: Profile[], activeProfileId: string, activeProfileName?: string) => {
  const backupData = {
    profiles,
    activeProfileId,
    version: '1.2',
    exportedAt: new Date().toISOString()
  };
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href",     dataStr);
  downloadAnchor.setAttribute("download", `גיבוי_יומן_טעימות_${activeProfileName || 'אריאל'}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
};

export const exportAllToExcel = async (foods: FoodItem[], activeProfileName?: string) => {
  try {
    const XLSX = await import('xlsx');
    
    const foodsSummary = foods.map(f => ({
      'שם המאכל': f.name,
      'קטגוריה': f.category,
      'שלב מומלץ': f.recommendedPhase || 1,
      'סטטוס': f.status,
      'מספר התנסויות': f.attempts.length
    }));
    const wsFoods = XLSX.utils.json_to_sheet(foodsSummary);

    const diaryLogs = foods.flatMap(f => 
      f.attempts.map(a => ({
        'תאריך': new Date(a.date).toLocaleDateString('he-IL'),
        'מאכל': f.name,
        'קטגוריה': f.category,
        'כמות': a.amount,
        'צורת הגשה': a.preparation || '',
        'תגובה': a.reaction,
        'הערות': a.notes || ''
      }))
    ).sort((a, b) => new Date(b['תאריך']).getTime() - new Date(a['תאריך']).getTime());

    const wsDiary = XLSX.utils.json_to_sheet(diaryLogs);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, wsFoods, 'סיכום מזונות');
    XLSX.utils.book_append_sheet(wb, wsDiary, 'יומן טעימות');
    
    XLSX.writeFile(wb, `יומן_טעימות_מלא_${activeProfileName || 'אריאל'}.xlsx`);
  } catch (error) {
    console.error('Failed to export all to excel', error);
    alert('אירעה שגיאה בייצוא ל-Excel');
  }
};

export const printMedicalPDFAll = (
  foods: FoodItem[],
  activeProfileName?: string,
  activeProfileBirthDate?: string,
  babyAge?: string | null
) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;
  
  const completedFoods = foods.filter(f => f.status === 'הושלם');
  const inProgressFoods = foods.filter(f => f.status === 'בתהליך');
  const sensitiveFoods = foods.filter(f => f.status === 'רגישות/תגובה');
  const triedFoods = foods.filter(f => f.attempts.length > 0);
  
  const allAttemptsSorted = foods.flatMap(f => 
    f.attempts.map(a => ({ ...a, foodName: f.name, foodIcon: f.icon, category: f.category }))
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const currentBabyAge = babyAge || 'לא צוין גיל';

  // Major clinical allergens matching
  const allergenMapping = [
    { name: 'בוטנים / חמאת בוטנים', searchTerms: ['בוטנים', 'peanut'] },
    { name: 'ביצה', searchTerms: ['ביצה', 'egg'] },
    { name: 'שומשום / טחינה', searchTerms: ['שומשום', 'טחינה', 'sesame', 'tahini'] },
    { name: 'חלב פרה / מוצרי חלב', searchTerms: ['חלב', 'milk', 'dairy'] },
    { name: 'דגים / מוצרי דג', searchTerms: ['דג', 'fish'] },
    { name: 'גלוטן / חיטה', searchTerms: ['חיטה', 'גלוטן', 'wheat', 'gluten'] },
    { name: 'סויה', searchTerms: ['סויה', 'soy'] },
    { name: 'אגוזי עץ (ממרח)', searchTerms: ['אגוז', 'nut'] }
  ];

  const allergenStatusList = allergenMapping.map(mapping => {
    const matchedFoods = foods.filter(f => 
      mapping.searchTerms.some(term => f.name.toLowerCase().includes(term.toLowerCase()))
    );

    if (matchedFoods.length === 0) {
      return {
        name: mapping.name,
        status: 'נעול' as Status,
        attemptsCount: 0,
        notes: 'טרם נוסף למאגר'
      };
    }

    let finalStatus: Status = 'נעול';
    let totalAttempts = 0;
    let combinedNotes: string[] = [];

    matchedFoods.forEach(f => {
      totalAttempts += f.attempts.length;
      if (f.status === 'רגישות/תגובה') {
        finalStatus = 'רגישות/תגובה';
      } else if (f.status === 'בתהליך' && finalStatus !== 'רגישות/תגובה') {
        finalStatus = 'בתהליך';
      } else if (f.status === 'הושלם' && finalStatus === 'נעול') {
        finalStatus = 'הושלם';
      }

      f.attempts.forEach(a => {
        if (a.notes || a.reaction !== 'ניטרלי') {
          combinedNotes.push(`${f.name}: ${a.reaction}${a.notes ? ` (${a.notes})` : ''}`);
        }
      });
    });

    return {
      name: mapping.name,
      status: finalStatus as Status,
      attemptsCount: totalAttempts,
      notes: combinedNotes.length > 0 ? combinedNotes.join('; ') : 'אין הערות מיוחדות'
    };
  });

  const allergenRows = allergenStatusList.map(a => {
    let statusClass = 'badge-muted';
    let statusText = 'טרם נחשף';
    if (a.status === 'הושלם') {
      statusClass = 'badge-success';
      statusText = 'נחשף בהצלחה';
    } else if (a.status === 'רגישות/תגובה') {
      statusClass = 'badge-danger';
      statusText = 'רגישות / תגובה';
    } else if (a.status === 'בתהליך') {
      statusClass = 'badge-warning';
      statusText = 'בתהליך חשיפה';
    }
    return `
      <tr>
        <td><strong>${a.name}</strong></td>
        <td><span class="badge ${statusClass}">${statusText}</span></td>
        <td style="text-align: center;">${a.attemptsCount}</td>
        <td>${a.notes}</td>
      </tr>
    `;
  }).join('');

  const sensitiveRows = sensitiveFoods.map(f => {
    const details = f.attempts
      .map(a => `[${new Date(a.date).toLocaleDateString('he-IL')}] כמות: ${a.amount}, תגובה: ${a.reaction}${a.notes ? ` (${a.notes})` : ''}`)
      .join('<br>');
    return `
      <tr>
        <td><strong>${f.icon} ${f.name}</strong></td>
        <td>${f.category}</td>
        <td style="text-align: center;">${f.attempts.length}</td>
        <td style="color: #b91c1c; font-weight: 600;">${details || 'לא תועדו תסמינים ספציפיים'}</td>
      </tr>
    `;
  }).join('');

  const phase1Count = completedFoods.filter(f => f.recommendedPhase === 1).length;
  const phase2Count = completedFoods.filter(f => f.recommendedPhase === 2).length;
  const phase3Count = completedFoods.filter(f => f.recommendedPhase === 3).length;

  let html = `
  <html dir="rtl" lang="he">
   <head>
     <title>דו"ח רפואי - מעקב טעימות - ${activeProfileName || 'אריאל'}</title>
     <link rel="preconnect" href="https://fonts.googleapis.com">
     <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
     <link href="https://fonts.googleapis.com/css2?family=Assistant:wght@300;400;500;600;700;800&family=Rubik:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
     <style>
       body { 
         font-family: 'Assistant', 'Rubik', system-ui, -apple-system, sans-serif; 
         padding: 40px; 
         color: #1e293b; 
         line-height: 1.6; 
         background-color: #fff;
       }
       h1, h2, h3, h4 {
         font-family: 'Rubik', sans-serif;
         font-weight: 700;
       }
       .header { 
         text-align: center; 
         margin-bottom: 30px; 
         border-bottom: 3px solid #475B4C; 
         padding-bottom: 20px; 
       }
       .header h1 { 
         color: #475B4C; 
         margin: 0; 
         font-size: 26px; 
       }
       .header p { 
         color: #64748b; 
         font-size: 13px; 
         margin: 5px 0 0 0; 
         font-weight: 600; 
       }
       
       .meta-grid { 
         display: grid; 
         grid-template-cols: 1fr 1fr; 
         gap: 12px 30px; 
         margin-bottom: 25px; 
         background: #f8fafc; 
         padding: 20px; 
         border-radius: 12px; 
         border: 1px solid #e2e8f0; 
       }
       .meta-item { 
         font-size: 13px; 
         font-weight: 700; 
       }
       .meta-label { 
         color: #64748b; 
         font-weight: 500;
         margin-left: 5px;
       }
       
       .section-title { 
         color: #475B4C; 
         border-bottom: 2px solid #e2e8f0; 
         padding-bottom: 6px; 
         margin-top: 35px; 
         margin-bottom: 15px; 
         font-size: 15px; 
         font-weight: 800;
       }
       
       /* Alert boxes */
       .alert-sensitive {
         background: #fef2f2;
         border: 2px solid #ef4444;
         border-radius: 8px;
         padding: 16px;
         margin-bottom: 25px;
       }
       .alert-sensitive h3 {
         color: #b91c1c;
         margin: 0 0 8px 0;
         font-size: 15px;
         display: flex;
         align-items: center;
         gap: 8px;
       }
       .alert-safe {
         background: #f0fdf4;
         border: 1px solid #bbf7d0;
         border-radius: 8px;
         padding: 14px;
         margin-bottom: 25px;
         color: #15803d;
         font-size: 13px;
         font-weight: 600;
       }

       /* Progress grid */
       .summary-grid { 
         display: grid; 
         grid-template-cols: repeat(4, 1fr); 
         gap: 12px; 
         margin-bottom: 25px; 
       }
       .summary-card { 
         background: #f8fafc; 
         border: 1px solid #e2e8f0; 
         padding: 12px; 
         border-radius: 8px; 
         text-align: center; 
       }
       .summary-card .val { 
         font-size: 20px; 
         font-weight: 800; 
         color: #475B4C; 
       }
       .summary-card .lbl { 
         font-size: 10px; 
         color: #64748b; 
         font-weight: 700; 
         margin-top: 2px;
       }
       
       table { 
         width: 100%; 
         border-collapse: collapse; 
         margin-top: 10px; 
         font-size: 11px; 
       }
       th, td { 
         border: 1px solid #e2e8f0; 
         padding: 8px 10px; 
         text-align: right; 
       }
       th { 
         background-color: #f1f5f9; 
         color: #334155; 
         font-weight: 700; 
       }
       tr:nth-child(even) { 
         background-color: #f8fafc; 
       }
       tr {
         page-break-inside: avoid;
       }
       
       /* Status badges */
       .badge { 
         display: inline-block; 
         padding: 2px 7px; 
         border-radius: 4px; 
         font-size: 9px; 
         font-weight: 700; 
       }
       .badge-success { color: #15803d; background: #dcfce7; border: 1px solid #bbf7d0; }
       .badge-danger { color: #b91c1c; background: #fecaca; border: 1px solid #fca5a5; }
       .badge-warning { color: #c2410c; background: #ffedd5; border: 1px solid #fed7aa; }
       .badge-muted { color: #64748b; background: #f1f5f9; border: 1px solid #e2e8f0; }
       
       @media print {
         body { padding: 0; }
         .no-print { display: none; }
       }
     </style>
   </head>
   <body>
     <div class="header">
       <h1>דו"ח מעקב טעימות קליני</h1>
       <p>מופק עבור צוות רפואי, טיפת חלב ואלרגולוגים</p>
     </div>
     
     <!-- 1. Patient Info -->
     <div class="meta-grid">
       <div class="meta-item"><span class="meta-label">שם המטופל/ת:</span> ${activeProfileName || 'אריאל'}</div>
       <div class="meta-item"><span class="meta-label">גיל נוכחי:</span> ${currentBabyAge}</div>
       <div class="meta-item"><span class="meta-label">תאריך לידה:</span> ${activeProfileBirthDate ? new Date(activeProfileBirthDate).toLocaleDateString('he-IL') : 'לא צוין'}</div>
       <div class="meta-item"><span class="meta-label">תאריך הפקת הדו"ח:</span> ${new Date().toLocaleDateString('he-IL')}</div>
     </div>
     
     <!-- 2. Critical Allergies Alert (First Priority) -->
     ${sensitiveFoods.length > 0 ? `
       <div class="alert-sensitive">
         <h3>⚠️ רגישויות ותגובות אלרגיות שנצפו (נפח קליני מוגבר)</h3>
         <p style="font-size: 11px; margin: 0 0 10px 0; font-weight: 600; color: #7f1d1d;">
           המזונות הבאים עוררו תגובה במהלך הטעימות. מומלץ להציג את הפירוט לרופא הילדים או אלרגולוג מומחה.
         </p>
         <table>
           <thead>
             <tr>
               <th style="width: 20%;">מאכל</th>
               <th style="width: 15%;">קטגוריה</th>
               <th style="width: 15%; text-align: center;">מספר ניסיונות</th>
               <th style="width: 50%;">פירוט תסמינים, מועד ותגובות שנרשמו</th>
             </tr>
           </thead>
           <tbody>
             ${sensitiveRows}
           </tbody>
         </table>
       </div>
     ` : `
       <div class="alert-safe">
         ✔️ <strong>סטטוס רגישויות:</strong> לא דווחו תגובות חריגות, רגישויות או חשד לאלרגיה במהלך החשיפות שנערכו עד כה.
       </div>
     `}

     <!-- 3. Clinical Allergen Status Table (Second Priority) -->
     <h2 class="section-title">🛡️ סטטוס חשיפת אלרגנים קליניים (Clinical Allergen Protocol)</h2>
     <p style="font-size: 10px; color: #64748b; margin: -10px 0 10px 0; font-weight: 600;">
       מעקב אחר 8 קבוצות האלרגנים השכיחות ביותר בילדות בהתאם להנחיות הטיפוליות העדכניות.
     </p>
     <table>
       <thead>
         <tr>
           <th style="width: 25%;">קבוצת אלרגן קליני</th>
           <th style="width: 25%;">סטטוס חשיפה</th>
           <th style="width: 15%; text-align: center;">ניסיונות בפועל</th>
           <th style="width: 35%;">פירוט תגובות / הערות קליניות</th>
         </tr>
       </thead>
       <tbody>
         ${allergenRows}
       </tbody>
     </table>

     <!-- 4. Progress Summary Stats -->
     <h2 class="section-title">📈 סיכום התקדמות כללי</h2>
     <div class="summary-grid">
       <div class="summary-card">
         <div class="val">${triedFoods.length}</div>
         <div class="lbl">מזונות שנוסו (מתוך 100)</div>
       </div>
       <div class="summary-card">
         <div class="val">${phase1Count}</div>
         <div class="lbl">שלב 1 שהושלמו (6ח')</div>
       </div>
       <div class="summary-card">
         <div class="val">${phase2Count}</div>
         <div class="lbl">שלב 2 שהושלמו (7ח')</div>
       </div>
       <div class="summary-card">
         <div class="val">${phase3Count}</div>
         <div class="lbl">שלב 3 שהושלמו (8ח'+)</div>
       </div>
     </div>

     <!-- 5. Chronological Log -->
     <h2 class="section-title">🗓️ יומן טעימות כרונולוגי מלא</h2>
     ${allAttemptsSorted.length > 0 ? `
       <table>
         <thead>
           <tr>
             <th style="width: 12%;">תאריך</th>
             <th style="width: 15%;">מאכל</th>
             <th style="width: 13%;">קטגוריה</th>
             <th style="width: 10%;">כמות</th>
             <th style="width: 13%;">צורת הגשה</th>
             <th style="width: 12%;">תגובה</th>
             <th style="width: 25%;">הערות ותסמינים</th>
           </tr>
         </thead>
         <tbody>
           ${allAttemptsSorted.map(a => `
             <tr>
               <td>${new Date(a.date).toLocaleDateString('he-IL')}</td>
               <td><strong>${a.foodIcon} ${a.foodName}</strong></td>
               <td>${a.category}</td>
               <td>${a.amount}</td>
               <td>${a.preparation || 'לא צוין'}</td>
               <td>
                 <span class="badge ${
                   a.reaction === 'אהב/ה' ? 'badge-success' : 
                   a.reaction === 'תגובה אלרגית' ? 'badge-danger' : 
                   a.reaction === 'סירב/ה' ? 'badge-warning' :
                   'badge-muted'
                 }">${a.reaction}</span>
               </td>
               <td>${a.notes || ''}</td>
             </tr>
           `).join('')}
         </tbody>
       </table>
     ` : '<p style="font-size: 11px; color: #64748b; font-weight: 600;">אין טעימות מתועדות ביומן כרגע.</p>'}
     
     <script>
       window.onload = function() {
         setTimeout(function() {
           window.print();
         }, 500);
       }
     </script>
   </body>
  </html>
  `;
  printWindow.document.write(html);
  printWindow.document.close();
};
