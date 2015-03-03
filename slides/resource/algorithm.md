##  Algorithm

1. to request send Tm;Pi request <!-- .element class="fragment" -->
2. When receive request, acknowledge <!-- .element class="fragment" -->
3. to release clean Tm;Pi request and send Tm;Pi release <!-- .element class="fragment" -->
4. When receive release, remove Tm;Pi request <!-- .element class="fragment" -->
5. Grant resource to Pi when <!-- .element class="fragment" -->


- There is a Tm;Pi request before others <!-- .element class="fragment" -->
- Pi received all acknowledgements <!-- .element class="fragment" -->

note:
    send to all processes is one event
