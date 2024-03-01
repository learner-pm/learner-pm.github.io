import{_ as n,b as s}from"./app.d7a1941d.js";const a={},p=s(`<h1 id="\u4EE3\u7406\u6A21\u5F0F" tabindex="-1"><a class="header-anchor" href="#\u4EE3\u7406\u6A21\u5F0F" aria-hidden="true">#</a> \u4EE3\u7406\u6A21\u5F0F</h1><p>\u4EE3\u7406\u6A21\u5F0F\u5C5E\u4E8E\u7ED3\u6784\u578B\u6A21\u5F0F</p><p>\u5728\u4EE3\u7406\u6A21\u5F0F\u4E2D\uFF0C\u4E00\u4E2A\u7C7B\u4EE3\u8868\u53E6\u4E00\u4E2A\u7C7B\u7684\u529F\u80FD</p><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token keyword">class</span> <span class="token class-name">Date</span> <span class="token punctuation">{</span>
  <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token parameter">url</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>url <span class="token operator">=</span> url<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token function">getDate</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">\u8FD9\u662F\u4ECE</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span><span class="token keyword">this</span><span class="token punctuation">.</span>url<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">\u8BF7\u6C42\u7684\u6570\u636E</span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
<span class="token keyword">class</span> <span class="token class-name">ProxyDate</span> <span class="token punctuation">{</span>
  #Date<span class="token punctuation">;</span>
  <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token parameter">url</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>url <span class="token operator">=</span> url<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token function">getDate</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span><span class="token keyword">this</span><span class="token punctuation">.</span>#Date<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span>#Date <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Date</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>url<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>#Date<span class="token punctuation">.</span><span class="token function">getDate</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
<span class="token keyword">const</span> proxyD <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ProxyDate</span><span class="token punctuation">(</span><span class="token string">&quot;www.xxxx.com/getDate&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
proxyD<span class="token punctuation">.</span><span class="token function">getDate</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br></div></div><h2 id="\u5E94\u7528\u573A\u666F" tabindex="-1"><a class="header-anchor" href="#\u5E94\u7528\u573A\u666F" aria-hidden="true">#</a> \u5E94\u7528\u573A\u666F</h2><div class="custom-container tip"><p class="custom-container-title">\u63D0\u793A</p><p>\u672A\u5B8C\u5F85\u7EED</p></div>`,6);function t(e,o){return p}var l=n(a,[["render",t],["__file","proxy.html.vue"]]);export{l as default};
