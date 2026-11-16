import './style.css';
import umbrella from 'lucide-static/icons/umbrella.svg?raw';
import home from 'lucide-static/icons/house.svg?raw';
import pen from 'lucide-static/icons/pencil.svg?raw';
import grid from 'lucide-static/icons/grid-2x2.svg?raw';
import prayer from 'lucide-static/icons/heart-handshake.svg?raw';
import book from 'lucide-static/icons/book-open.svg?raw';
import sprout from 'lucide-static/icons/sprout.svg?raw';
import flower from 'lucide-static/icons/flower-2.svg?raw';
import heart from 'lucide-static/icons/heart.svg?raw';
import calendar from 'lucide-static/icons/calendar-days.svg?raw';
import check from 'lucide-static/icons/check.svg?raw';
import next from 'lucide-static/icons/chevron-right.svg?raw';
import prev from 'lucide-static/icons/chevron-left.svg?raw';

type Entry = { reflection:string; practice:string; date:string };
const tabs = {today:['오늘',home],share:['나눔',pen],week:['인증표',grid],prayer:['기도',prayer]};
type Tab = keyof typeof tabs;
const states = {
  full: { symbol:heart, title:'통독·묵상과 기도', detail:'말씀을 읽고 묵상하고 기도했어요' },
  read: { symbol:heart, title:'통독만 했어요', detail:'오늘의 말씀을 읽었어요' },
  miss: { symbol:umbrella, title:'못 했어요', detail:'오늘은 쉬어가요' }
};
type Mark = keyof typeof states;
const root = document.querySelector<HTMLElement>('#app')!;
const entryKey = 'quiet-time-entry-v1', markKey = 'quiet-time-status-v1';
function read<T>(key:string,fallback:T):T {
  try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback; } catch {return fallback;}
}
function persist(key:string,value:unknown) { localStorage.setItem(key,JSON.stringify(value)); }
function esc(s:string) { return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!)); }
function dayKey(d=new Date()) { return d.toLocaleDateString('sv-SE'); }
function currentTab():Tab { const hash=location.hash.slice(1); return Object.hasOwn(tabs,hash)?hash as Tab:'today'; }
function icon(svg:string) { return '<span class="icon" aria-hidden="true">'+svg+'</span>'; }
function entries() { return read<Entry[]>(entryKey,[]); }
function nav() { return '<nav aria-label="주 메뉴">'+Object.entries(tabs).map(([id,[name,svg]])=>`<a href="#${id}" ${currentTab()===id?'aria-current="page"':''}>${icon(svg)}${name}</a>`).join('')+'</nav>'; }
const examples = [
  {name:'익명의 형제',text:'오늘 말씀을 통해, 바쁜 가운데서도 먼저 하나님을 구하는 마음이 중요하다는 것을 다시 느꼈습니다.'},
  {name:'익명의 자매',text:'하나님, 제 삶의 우선순위가 늘 주님이 되게 하시고, 염려보다 주님의 나라를 먼저 구하는 하루가 되게 해주세요.'}
];
function post(name:string,text:string,stamp:string,id:string,index:number) {
 const liked=read<string[]>('quiet-likes',[]).includes(id);
 return `<article class="post"><div class="avatar a${index%2}">${icon(index%2?flower:sprout)}</div><div><header><strong>${esc(name)}</strong><small>${esc(stamp)}</small></header><p>${esc(text)}</p><button data-like="${esc(id)}" aria-pressed="${liked}">${icon(heart)} 공감${liked?' 1':''}</button></div></article>`;
}
function todayView() {
 const date=new Intl.DateTimeFormat('ko',{month:'short',day:'numeric'}).format(new Date());
 return `<div class="landscape"></div><div class="heading-row"><h1>오늘의 말씀</h1><span class="date">${icon(calendar)} ${date}</span></div>
 <section class="verse"><small>마태복음 6장 33절</small><blockquote>그러므로 너희는 먼저<br>그의 나라와 그의 의를 구하라<br>그리하면 이 모든 것을<br>너희에게 더하시리라.</blockquote></section>
 <a class="read" href="#share">${icon(book)} 오늘의 묵상 나누기 ${icon(next)}</a>
 <div class="heading-row"><h2>우리의 나눔</h2><small>최신순</small></div>
 ${entries().map((e,i)=>post('나의 나눔',[e.reflection,e.practice].filter(Boolean).join('\n\n'),e.date,e.date,i)).join('')}
 ${examples.map((e,i)=>post(e.name,e.text,'나눔 예시','example-'+i,i)).join('')}`;
}
function shareView() {
 const entry=entries().find(e=>e.date===dayKey());
 return `<h1>나눔</h1><p class="intro">오늘 말씀을 따라 묵상한 것과 기도를 나눠요.</p><form id="share-form">
 <section class="field"><label for="reflection">${icon(book)} 묵상과 기도</label><p>오늘 말씀을 통해 깨닫고 느낀 점을 나눠주세요.</p><textarea name="reflection" id="reflection" placeholder="예) 오늘 말씀을 통해 제가 배운 것은 …">${esc(entry?.reflection||'')}</textarea></section>
 <section class="field"><label for="practice">${icon(prayer)} 적용과 실천</label><p>오늘 말씀을 삶에서 어떻게 실천할지 적어주세요.</p><textarea name="practice" id="practice" placeholder="예) 오늘은 먼저 따뜻한 말을 건네겠습니다.">${esc(entry?.practice||'')}</textarea></section>
 <button class="save">${icon(check)} 저장하기</button><small class="note">작성한 내용은 이 기기에 저장돼요.</small></form>`;
}
let weekOffset=0;
const weekDays=['월','화','수','목','금','토','일'];
function statusIcon(mark:Mark) {
 return `<span class="mark mark-${mark}" aria-hidden="true">${states[mark].symbol}</span>`;
}
function markCell(mark?:Mark) {
 return mark && states[mark] ? `${statusIcon(mark)}<span class="sr">${states[mark].title}</span>` : '<span aria-hidden="true">—</span><span class="sr">미기록</span>';
}
function member(name:string, peach=false) {
 return `<span class="member ${peach?'peach':''}">${icon(peach?flower:sprout)}<span>${name}</span></span>`;
}
function weekView() {
 const mon=new Date(); mon.setDate(mon.getDate()-(mon.getDay()+6)%7+weekOffset*7);
 const dates=weekDays.map((_,i)=>{const d=new Date(mon);d.setDate(d.getDate()+i);return dayKey(d);});
 const marks=read<Record<string,Mark>>(markKey,{});
 const samples:Mark[][]=[['full','read','full','miss','full','read','full'],['read','full','full','read','full','full','read'],['miss','full','read','full','read','full','full']];
 return `<h1>인증표</h1><p class="intro">우리 소그룹의 한 주 묵상 참여를 함께 확인해요.</p>
 <div class="week-switch"><button aria-label="지난 주" data-week="-1">${icon(prev)}</button>${icon(calendar)} ${weekOffset===0?'이번 주':dates[0].slice(5).replace('-','.')+' – '+dates[6].slice(5).replace('-','.')}<button aria-label="다음 주" data-week="1" ${weekOffset===0?'disabled':''}>${icon(next)}</button></div>
 <div class="table-wrap"><table><caption class="sr">주간 큐티 인증표</caption><colgroup><col class="name-column"><col span="7"></colgroup><thead><tr><th>멤버</th>${weekDays.map(d=>`<th scope="col">${d}</th>`).join('')}</tr></thead><tbody>
 <tr><th scope="row">${member('나의 기록')}</th>${dates.map(d=>`<td>${markCell(marks[d])}</td>`).join('')}</tr>
 ${weekOffset===0?samples.map((row,i)=>`<tr><th scope="row">${member('익명의 '+(i%2?'자매 ':'형제 ')+String.fromCharCode(65+i),i%2===1)}</th>${row.map(m=>`<td>${markCell(m)}</td>`).join('')}</tr>`).join(''):''}</tbody></table></div>${weekOffset===0?'<small class="sample-note">익명 목원 행은 예시입니다.</small>':''}
 <div class="legend"><b>표시<br>안내</b><div>${(Object.keys(states) as Mark[]).map(k=>`<p>${statusIcon(k)}<span><strong>${states[k].title}</strong> <small>(${states[k].detail})</small></span></p>`).join('')}</div></div>
 <h2 class="record-title">오늘의 기록</h2><div class="choices">${(Object.keys(states) as Mark[]).map(k=>`<button data-mark="${k}" aria-pressed="${marks[dayKey()]===k}">${statusIcon(k)} ${states[k].title}</button>`).join('')}</div>`;
}
function prayerView() {
 const notes=entries().filter(e=>e.reflection);
 return `<h1>기도</h1><p class="intro">이 기기에 남긴 묵상과 기도를 돌아봐요.</p>${notes.map((e,i)=>post('나의 묵상과 기도',e.reflection,e.date,e.date,i)).join('')||'<p class="field">아직 남긴 기도가 없어요.</p>'}<a class="read" href="#share">${icon(pen)} 묵상과 기도 쓰기</a>`;
}
function render(message='') {
 const tab=currentTab();
 root.innerHTML=`<div class="shell ${tab}"><header class="brand"><a href="#today"><span class="cross" aria-hidden="true"></span>소그룹<br>매일 묵상</a></header><main id="content">${({today:todayView,share:shareView,week:weekView,prayer:prayerView})[tab]()}<div role="status" class="feedback">${esc(message)}</div></main>${nav()}</div>`;
}
root.addEventListener('submit',e=>{
 e.preventDefault(); const form=e.target as HTMLFormElement;const data=new FormData(form);
 const reflection=String(data.get('reflection')||'').trim(),practice=String(data.get('practice')||'').trim();
 const feedback=root.querySelector<HTMLElement>('.feedback')!;
 if(!reflection&&!practice){feedback.textContent='묵상과 기도 또는 적용과 실천을 적어 주세요.';form.querySelector('textarea')?.focus();return;}
 try { const date=dayKey();persist(entryKey,[{date,reflection,practice},...entries().filter(e=>e.date!==date)]);feedback.textContent='이 기기에 저장했어요.'; }
 catch {feedback.textContent='저장 공간을 확인한 후 다시 시도해 주세요.';}
});
root.addEventListener('click',e=>{
 const btn=(e.target as Element).closest('button'); if(!btn)return;
 const {like,mark,week}=btn.dataset;
 try {
 if(week){weekOffset=Math.min(0,weekOffset+Number(week));render();}
 if(mark){persist(markKey,{...read(markKey,{}),[dayKey()]:mark});weekOffset=0;render('오늘의 기록을 저장했어요.');}
 if(like){const likes=read<string[]>('quiet-likes',[]);persist('quiet-likes',likes.includes(like)?likes.filter(x=>x!==like):[...likes,like]);render();}
 } catch {root.querySelector<HTMLElement>('.feedback')!.textContent='저장 공간을 확인해 주세요.';}
});
window.addEventListener('hashchange',()=>{render();window.scrollTo(0,0);});
render();
