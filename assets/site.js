(function(){
  'use strict';

  /* ---- 滚动出现 ---- */
  var rvs = Array.prototype.slice.call(document.querySelectorAll('.rv'));
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });
    rvs.forEach(function(el){ io.observe(el); });
  } else {
    rvs.forEach(function(el){ el.classList.add('in'); });
  }

  /* ---- Skill 筛选 ---- */
  var grid = document.getElementById('skillGrid');
  var chips = Array.prototype.slice.call(document.querySelectorAll('.chip'));
  chips.forEach(function(btn){
    btn.addEventListener('click', function(){
      var f = btn.getAttribute('data-f');
      chips.forEach(function(b){ b.setAttribute('aria-pressed', String(b === btn)); });
      Array.prototype.forEach.call(grid.children, function(card){
        var ok = (f === 'all' || card.getAttribute('data-cat') === f);
        if (ok) { card.removeAttribute('hidden'); } else { card.setAttribute('hidden', 'hidden'); }
      });
    });
  });

  /* ---- GitHub 实时数据 ---- */
  var API = 'https://api.github.com/users/amxi0303-cell';
  function put(key, val){
    Array.prototype.forEach.call(document.querySelectorAll('[data-gh="' + key + '"]'), function(el){
      el.textContent = val;
    });
  }
  function stamp(){
    var d = new Date();
    var t = ('0' + (d.getMonth() + 1)).slice(-2) + '.' + ('0' + d.getDate()).slice(-2) + ' ' +
            ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2);
    put('time', t);
  }
  stamp();
  if (window.fetch) {
    Promise.all([
      fetch(API, { headers: { 'Accept': 'application/vnd.github+json' } }).then(function(r){ return r.ok ? r.json() : null; }),
      fetch('https://api.github.com/users/amxi0303-cell/repos?per_page=100&type=public', { headers: { 'Accept': 'application/vnd.github+json' } }).then(function(r){ return r.ok ? r.json() : null; })
    ]).then(function(res){
      var user = res[0], repos = res[1];
      if (user) {
        put('followers', user.followers);
        if (typeof user.public_repos === 'number') put('repos', user.public_repos);
      }
      if (Array.isArray(repos)) {
        var stars = 0, forks = 0;
        var owned = repos.filter(function(r){ return !r.fork; });
        owned.forEach(function(r){ stars += r.stargazers_count || 0; forks += r.forks_count || 0; });
        put('stars', stars);
        put('forks', forks);
        if (!user) put('repos', owned.length);
      }
    }).catch(function(){
      put('stars', '—'); put('forks', '—'); put('followers', '—'); put('status', '接口暂不可用，数据请在仓库页查看');
    });
  }
})();
