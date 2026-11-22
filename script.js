// THE LIVING ARCHIVE — interaction layer
const $=(s,root=document)=>root.querySelector(s), $$=(s,root=document)=>[...root.querySelectorAll(s)];
window.addEventListener('load',()=>setTimeout(()=>$('#loader')?.classList.add('done'),1500));
const menu=$('.menu-toggle'),nav=$('.topbar nav');menu?.addEventListener('click',()=>nav.classList.toggle('open'));$$('.topbar nav a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
const progress=$('.scroll-progress span');function scrollUI(){const max=document.documentElement.scrollHeight-innerHeight;progress.style.width=(max>0?scrollY/max*100:0)+'%'}window.addEventListener('scroll',scrollUI,{passive:true});scrollUI();
const revealObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');revealObserver.unobserve(e.target)}}),{threshold:.1});$$('.reveal').forEach(el=>revealObserver.observe(el));
// Subtle ambient dust, drawn locally with canvas.
(()=>{const c=$('#dust'),ctx=c.getContext('2d');let w,h,particles=[];function resize(){w=c.width=innerWidth*devicePixelRatio;h=c.height=innerHeight*devicePixelRatio;particles=Array.from({length:Math.min(90,Math.floor(innerWidth/13))},()=>({x:Math.random()*w,y:Math.random()*h,r:(Math.random()*1.5+.3)*devicePixelRatio,v:(Math.random()*.22+.04)*devicePixelRatio,a:Math.random()*.45+.08,p:Math.random()*6.28}))}function draw(){ctx.clearRect(0,0,w,h);for(const p of particles){p.y-=p.v;p.x+=Math.sin(p.p+=.008)*.15*devicePixelRatio;if(p.y<0){p.y=h;p.x=Math.random()*w}ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=`rgba(218,184,120,${p.a})`;ctx.fill()}requestAnimationFrame(draw)}addEventListener('resize',resize);resize();draw()})();
// Gentle pointer tilt on the two destination panels.
$$('.card-tilt').forEach(card=>{card.addEventListener('pointermove',e=>{if(innerWidth<800)return;const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.transform=`perspective(900px) rotateY(${x*3}deg) rotateX(${-y*3}deg) translateY(-3px)`});card.addEventListener('pointerleave',()=>card.style.transform='')});
// Vocabulary cards flip to reveal a definition.
$$('.vocab-card').forEach(card=>card.addEventListener('click',()=>card.classList.toggle('flipped')));
// Manuscript anatomy interaction.
const details={
initial:['Decorated initial','A decorated initial is an enlarged or ornamented first letter. It can mark the beginning of a text or an important section, guiding the reader while displaying the skill of the artist.'],
miniature:['Miniature painting','Miniatures are small, carefully composed images. They may illustrate a biblical scene, a historical event, a person or a symbolic idea. Their colours and visual details are valuable evidence for art historians.'],
text:['Handwritten text','The script itself can reveal clues about a manuscript: letter forms, spelling, layout and the way lines are arranged. Specialists compare these features when studying a book’s date, origin and scribal tradition.'],
margin:['Marginal notes','Notes in the margins may include corrections, explanations, ownership marks or comments by later readers. They can show that a manuscript continued to be read and used long after it was made.']
};
function setDetail(key){const d=details[key];if(!d)return;$('#detail-title').textContent=d[0];$('#detail-copy').textContent=d[1];$$('.detail-tab').forEach(b=>b.classList.toggle('active',b.dataset.detail===key));$$('.hotspot').forEach(b=>b.classList.toggle('active',b.dataset.detail===key))}
$$('[data-detail]').forEach(b=>b.addEventListener('click',()=>setDetail(b.dataset.detail)));setDetail('initial');
// FAQ accordion.
$$('.faq-item>button').forEach(btn=>btn.addEventListener('click',()=>{const item=btn.parentElement,answer=$('.faq-answer',item),wasOpen=item.classList.contains('open');$$('.faq-item').forEach(other=>{other.classList.remove('open');$('.faq-answer',other).style.maxHeight=null});if(!wasOpen){item.classList.add('open');answer.style.maxHeight=answer.scrollHeight+'px'}}));
// 20-question learning challenge.
const questions=[
['HISTORY','According to the Matenadaran, the roots of its manuscript tradition reach back to which century?',['3rd century','5th century','9th century','15th century'],1,'The Matenadaran’s historical review connects its origins with the 5th century and the establishment of Armenian writing.'],
['HISTORY','In which year was the Catholicosate of Armenia re-established at Saint Etchmiadzin?',['301','885','1045','1441'],3,'The historical review identifies 1441 as the year the Catholicosate was re-established at Etchmiadzin.'],
['HISTORY','When was the manuscript collection transferred to Yerevan?',['1915','1922','1939','1959'],2,'The manuscript collection was transferred to Yerevan in 1939.'],
['HISTORY','On what date did the Matenadaran receive research institute status?',['3 March 1959','18 October 2012','5 September 1962','24 April 1915'],0,'The institution received the status of a research institute on 3 March 1959.'],
['HISTORY','In which year was the Yerevan Matenadaran named after Mesrop Mashtots?',['1939','1959','1962','2012'],2,'The institution was named after Mesrop Mashtots in 1962.'],
['ETCHMIADZIN','When was the Vatche and Tamar Manookian Matenadaran officially opened?',['18 October 2012','3 March 1959','21 September 1991','1 January 2000'],0,'The official opening took place on 18 October 2012.'],
['ETCHMIADZIN','Who designed the Manookian Matenadaran building?',['Mark Grigoryan','Artak Ghulyan','Alexander Tamanyan','Rafael Israelyan'],1,'The Mother See’s official page names Artak Ghulyan as the architect.'],
['ETCHMIADZIN','Which monastery is mentioned in the view from the Manookian library windows?',['Geghard','Noravank','Saint Gayane','Tatev'],2,'The library’s tall windows overlook Saint Gayane Monastery and Mount Masis.'],
['ETCHMIADZIN','In which city was the first printed Armenian Bible published in 1666?',['Venice','Amsterdam','Paris','Constantinople'],1,'The first printed Armenian Bible was published in Amsterdam in 1666.'],
['MANUSCRIPTS','What is a colophon?',['A type of ink','A note that may record details about a manuscript','A book cover','A library room'],1,'A colophon can record a scribe, date, place, patron or other details about the manuscript.'],
['MANUSCRIPTS','What does “parchment” mean?',['A prepared writing material made from animal skin','A metal plate','A kind of stone','A printing machine'],0,'Parchment is a writing surface made from prepared animal skin.'],
['MANUSCRIPTS','What is a miniature in a manuscript?',['A tiny book','A small detailed painting','A handwritten index','A binding technique'],1,'A miniature is a small, detailed illustration within a manuscript.'],
['MANUSCRIPTS','What can marginal notes tell researchers?',['Only the price of a book','Nothing about its history','How later readers used or annotated it','The exact weight of the parchment'],2,'Marginal notes may preserve corrections, ownership marks and comments from later readers.'],
['RESEARCH','Which of these subjects is represented in the Matenadaran’s collections?',['Medicine','Mathematics','Philosophy','All of these'],3,'The collection covers a wide range of subjects, including medicine, mathematics and philosophy.'],
['RESEARCH','Why are some medieval Armenian translations especially important?',['They are always illustrated','They preserve works whose original versions were lost','They were all printed','They contain no foreign ideas'],1,'Some works are now known only through Armenian translations.'],
['CONSERVATION','When was the Matenadaran’s Restoration Department established?',['1828','1913','1939','2012'],2,'The Restoration Department was established in 1939, the year the collection moved to Yerevan.'],
['CONSERVATION','Which materials does the Restoration Department work with?',['Paper and parchment','Miniatures and graphic works','Archival documents','All of these'],3,'The department specialises in paper and parchment manuscripts, archival documents, miniatures and graphic works.'],
['CONSERVATION','What is the main goal of conservation?',['Make every manuscript look new','Preserve an object while respecting its historical material','Replace old pages with modern pages','Remove all signs of age'],1,'Conservation aims to stabilise and protect an object while respecting its historical evidence.'],
['COMPARISON','Which institution is a research institute and museum in Yerevan?',['Manookian Matenadaran','Mesrop Mashtots Matenadaran','Both are in Yerevan','Neither'],1,'The Mesrop Mashtots Matenadaran is in Yerevan.'],
['COMPARISON','What is the shared purpose of both institutions?',['To publish only new novels','To preserve, study and share written heritage','To collect modern newspapers only','To replace libraries'],1,'Both institutions help preserve and make written heritage available for study.']
];
let qi=0,score=0,locked=false;
const qCount=$('#quiz-count'),qScore=$('#quiz-score'),qBar=$('#quiz-bar'),qCat=$('#quiz-category'),qText=$('#quiz-question'),qAnswers=$('#quiz-answers'),qFeedback=$('#quiz-feedback'),qNext=$('#quiz-next'),qArea=$('#quiz-area'),qResult=$('#quiz-result');
function drawQuestion(){locked=false;const q=questions[qi];qCount.textContent=`QUESTION ${String(qi+1).padStart(2,'0')} / ${questions.length}`;qScore.textContent=`SCORE ${String(score).padStart(2,'0')}`;qBar.style.width=`${qi/questions.length*100}%`;qCat.textContent=q[0];qText.textContent=q[1];qFeedback.textContent='';qNext.disabled=true;qNext.innerHTML=qi===questions.length-1?'SEE YOUR RESULT <b>→</b>':'NEXT QUESTION <b>→</b>';qAnswers.innerHTML='';q[2].forEach((a,i)=>{const b=document.createElement('button');b.className='quiz-answer';b.textContent=String.fromCharCode(65+i)+'. '+a;b.addEventListener('click',()=>answerQuestion(i,b));qAnswers.appendChild(b)})}
function answerQuestion(index,clicked){if(locked)return;locked=true;const q=questions[qi],buttons=$$('.quiz-answer',qAnswers);buttons.forEach((b,i)=>{b.disabled=true;if(i===q[3])b.classList.add('correct')});if(index===q[3]){score++;qFeedback.textContent='Correct. '+q[4]}else{clicked.classList.add('wrong');qFeedback.textContent='Not quite. '+q[4]}qScore.textContent=`SCORE ${String(score).padStart(2,'0')}`;qNext.disabled=false}
qNext.addEventListener('click',()=>{if(!locked)return;qi++;if(qi<questions.length){drawQuestion();return}qArea.hidden=true;qBar.style.width='100%';qCount.textContent='CHALLENGE COMPLETED';qScore.textContent=`SCORE ${String(score).padStart(2,'0')}`;let grade=score>=18?'Master of the Archive':score>=15?'Excellent Researcher':score>=11?'Curious Explorer':'The Journey Has Just Begun';let message=score>=18?'An exceptional result. You have remembered the details and the bigger picture.':score>=15?'A strong result. You understand the history and the role of both institutions.':score>=11?'Well done. Revisit the sections and discover a few more details.':'Every expert begins with curiosity. Explore the exhibition again and give it another try.';qResult.hidden=false;qResult.className='quiz-result';qResult.innerHTML=`<strong>${score}/20</strong><h3>${grade}</h3><p>${message}</p><button class="hero-button" id="quiz-restart">TRY AGAIN ↻</button>`;$('#quiz-restart').addEventListener('click',()=>{qi=0;score=0;qResult.hidden=true;qArea.hidden=false;drawQuestion()})});drawQuestion();
// Reveal first viewport immediately in case observer initial callback is delayed.
setTimeout(()=>{$$('.hero .reveal').forEach(el=>el.classList.add('visible'))},350);
const musicToggle = document.getElementById('musicToggle');
const bgMusic = document.getElementById('bgMusic');
if (musicToggle && bgMusic) {
  musicToggle.addEventListener('click', () => {
    if (bgMusic.paused) {
      bgMusic.play();
      musicToggle.textContent = '🔇';
    } else {
      bgMusic.pause();
      musicToggle.textContent = '🔊';
    }
  });
}
