import{_ as n,b as s}from"./app.a929a6e7.js";const a={},p=s(`<p>js \u7C7B\u578B\u548C\u5F3A\u7C7B\u578B\u8BED\u8A00\u533A\u5206 number \u7684 bigint \u6DF1\u5165 \u6DF1\u62F7\u8D1D\u5305\u542B js \u5185\u7F6E\u5BF9\u8C61 \u53D8\u91CF\u547D\u540D \u666E\u901A\u51FD\u6570\u76F8\u5173\u77E5\u8BC6\uFF0C\u51FD\u6570\u4E00\u7B49\u516C\u6C11\uFF0Ces6 \u51FD\u6570\u589E\u52A0 \u7BAD\u5934\u51FD\u6570\u7684 this \u539F\u578B\u94FE\u548C\u7EE7\u627F\uFF0C\u65B9\u6CD5\u6765\u6E90\uFF0Cjs \u5185\u7F6E\u5BF9\u8C61\u6765\u6E90 this \u6307\u5411\uFF0Cjs \u6CA1\u6709\u7F16\u8BD1\uFF0C\u53EA\u6709\u8FD0\u884C\u65F6 \u5F02\u6B65\uFF0C\u6D4F\u89C8\u5668\u5185\u7F6E\u7EBF\u7A0B\uFF0C\u7EBF\u7A0B\u548C\u8FDB\u7A0B\uFF0C\u4E00\u4E2A\u9875\u9762\u76F8\u5173\uFF0C\u51FA\u53D1\u5F02\u6B65\u65B9\u5F0F\u3002\u65F6\u95F4\u7247 \u6A21\u5757\uFF0C\u9762\u5411\u672A\u6765\u7684\u524D\u7AEF\u5F00\u53D1 \u524D\u7AEF\u5DE5\u7A0B\u5316\u5F00\u53D1\uFF0C\u5355 html \u9875\u9762 \u89E3\u8026 \u63A2\u7D22\u6253\u5305\u5199\u5199\u63D2\u4EF6</p><p>\u9875\u9762\u6E32\u67D3\u673A\u5236 -&gt; \u4F18\u5316\u7B56\u7565 -&gt; vue react \u6846\u67B6\u4F18\u5316 \u524D\u7AEF\u50A8\u5B58\u673A\u5236\uFF0Ctkoen cookie \u8EAB\u4EFD\u4EE4\u724C \u7F51\u7EDC\u8BF7\u6C42 tcp \u6A21\u578B -&gt; \u73B0\u4EE3\u6D4F\u89C8\u5668\u5BF9\u4E8E\u7F51\u7EDC\u8BF7\u6C42\u7684\u6D41\u7A0B ipv6 https http2.0 http1.0 \u8DE8\u57DF \u548C \u4EE3\u7406 \u6570\u636E\u5B89\u5168\uFF0C\u811A\u672C\u5B89\u5168 \u6027\u80FD\u4F18\u5316\u548C\u5408\u5E76\u5230\u6E32\u67D3\uFF0C+\u7F51\u7EDC\u8BF7\u6C42\u4F18\u5316</p><p>\u57FA\u7840\u6570\u636E\u7ED3\u6784\uFF0C\u548C\u524D\u7AEF\u76F8\u5173\u91CD\u70B9\u5B66\u4E60 \u5404\u79CD\u7B97\u6CD5 + \u5B9E\u4F8B leetcode \u8BBE\u8BA1\u6A21\u5F0F\u4F7F\u7528 + \u5B9E\u4E60\u9047\u5230\u4F7F\u7528 + \u81EA\u5DF1\u6846\u67B6\u4F7F\u7528</p><p>\u9879\u76EE blog loginReact \u6BD5\u4E1A\u8BBE\u8BA1 0-1 \u7B80\u5386\u5728\u7EBF vue \u54CD\u5E94\u5F0F\u6A21\u677F\u6846\u67B6 minVue\uFF1F \u5C01\u88C5 ajax \u53D1\u9001\u8BF7\u6C42 -&gt; \u53D1\u5E03\u5230 npm GitHub \u6A21\u62DF promise</p><p>\u4F7F\u7528\u884C\u4E1A\u65B0\u6280\u672F vite \u4F53\u9A8C</p><p>\u5404\u79CD\u60F3\u6CD5 \u5199\u6CD5 \u4F53\u9A8C</p><p>vaios router ajax \u4F5C\u4E3A\u7B2C\u4E00\u9879\u76EE\u5F00\u6E90 blog \u4F5C\u4E3A\u57FA\u7840\u77E5\u8BC6\u50A8\u5907 \u6BD5\u4E1A\u9879\u76EE</p><p>\u5B9E\u4E60\u7ECF\u5386</p><p>\u5B9A\u4E49<code>MyPromise</code>\u7C7B</p><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token keyword">class</span> <span class="token class-name">MyPromise</span> <span class="token punctuation">{</span>
  <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token parameter">fun</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> fun <span class="token operator">!==</span> <span class="token string">&quot;function&quot;</span><span class="token punctuation">)</span> <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">Error</span><span class="token punctuation">(</span><span class="token string">&quot;it need a function&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token function">fun</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>resolve<span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">.</span>reject<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  state <span class="token operator">=</span> <span class="token constant">PENDING</span><span class="token punctuation">;</span>
  value <span class="token operator">=</span> <span class="token keyword">undefined</span><span class="token punctuation">;</span>
  errResion <span class="token operator">=</span> <span class="token keyword">undefined</span><span class="token punctuation">;</span>
  callBackReject <span class="token operator">=</span> <span class="token keyword">undefined</span><span class="token punctuation">;</span>
  callBackResolve <span class="token operator">=</span> <span class="token keyword">undefined</span><span class="token punctuation">;</span>
  cache <span class="token operator">=</span> <span class="token keyword">undefined</span><span class="token punctuation">;</span>
  <span class="token function-variable function">resolve</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter">value</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>state <span class="token operator">=</span> <span class="token constant">FULFILED</span><span class="token punctuation">;</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>value <span class="token operator">=</span> value<span class="token punctuation">;</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>cache <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>callBackResolve <span class="token operator">&amp;&amp;</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">callBackResolve</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>
  <span class="token function-variable function">reject</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter">errResion</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>state <span class="token operator">=</span> <span class="token constant">REJECTED</span><span class="token punctuation">;</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>errResion <span class="token operator">=</span> errResion<span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>
  <span class="token function">then</span><span class="token punctuation">(</span><span class="token parameter">callResolve<span class="token punctuation">,</span> callReject</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>state <span class="token operator">===</span> <span class="token constant">FULFILED</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token function">callResolve</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>value<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>state <span class="token operator">===</span> <span class="token constant">REJECTED</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token function">callReject</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>errResion<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>state <span class="token operator">===</span> <span class="token constant">PENDING</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span>callBackResolve <span class="token operator">=</span> callResolve<span class="token punctuation">;</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span>callBackReject <span class="token operator">=</span> callReject<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token comment">// const _promise = new MyPromise((resolve, reject) =&gt; {</span>
    <span class="token comment">//     return</span>
    <span class="token comment">// });</span>
    <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">MyPromise</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">resolve<span class="token punctuation">,</span> reject</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>state <span class="token operator">=</span> <span class="token constant">FULFILED</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">const</span> x <span class="token operator">=</span> <span class="token function">callResolve</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>value<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>x <span class="token keyword">instanceof</span> <span class="token class-name">MyPromise</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          x<span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span>resolve<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
          <span class="token function">resolve</span><span class="token punctuation">(</span>x<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token function">test</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>fun<span class="token punctuation">)</span><span class="token punctuation">;</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;11&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br></div></div>`,10);function t(e,o){return p}var l=n(a,[["render",t],["__file","index.html.vue"]]);export{l as default};