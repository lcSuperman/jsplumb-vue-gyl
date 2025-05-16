
const clickOutside = {
   bind(el, binding, vnode) {
    function documentClick(e) {
      if (!el.contains(e.target)) {
          binding.value(e);
      }
    }
    el.__clickOutside__ = documentClick;
    document.addEventListener('mousedown', documentClick);
  },
   unbind(el) {
    document.removeEventListener('mousedown', el.__clickOutside__);
    delete el.__clickOutside__;
  },
};
 
export default clickOutside;