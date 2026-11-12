
const toggle=document.querySelector('.menu-toggle');
const links=document.querySelector('.navlinks');
if(toggle&&links){toggle.addEventListener('click',()=>{const open=links.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));toggle.textContent=open?'×':'☰';});}
document.querySelectorAll('.navlinks a').forEach(a=>{if(a.href===location.href||a.pathname===location.pathname)a.classList.add('active');});
document.querySelectorAll('[data-contact-form]').forEach(form=>form.addEventListener('submit',e=>{
 e.preventDefault();const note=form.querySelector('.form-note');const data=new FormData(form);
 if(!form.reportValidity())return;
 const subject=encodeURIComponent('Website enquiry from '+(data.get('name')||'Website visitor'));
 const body=encodeURIComponent(`Name: ${data.get('name')}\nEmail: ${data.get('email')}\nCompany: ${data.get('company')||'-'}\nMessage: ${data.get('message')}`);
 note.textContent=document.documentElement.lang==='id'?'Aplikasi email Anda akan terbuka dengan pesan yang sudah disiapkan. Hubungkan layanan formulir untuk pengiriman langsung melalui website.':'Your email app will open with the message prepared. Connect a form service for direct online submissions.';
 window.location.href=`mailto:info@cacapack.co.id?subject=${subject}&body=${body}`;
}));
document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());
