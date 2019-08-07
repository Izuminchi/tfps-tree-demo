import { mount, shallowMount, createLocalVue } from '@vue/test-utils'
import Component from '@/views/Register.vue'
import BootstrapVue from 'bootstrap-vue'
import HotTable from '@handsontable/vue'
import SampleData from '@/sample_data.js'

const localVue = createLocalVue()
localVue.use(BootstrapVue)
localVue.use(HotTable)

describe('add', () => {
  
  it ('values have to be set after button is clicked', () => {
    const wrapper = mount(Component, {
      attachToDocument: true,
      localVue: localVue
    })
    wrapper.find('.add-operator').trigger('click')
    expect(wrapper.vm.modalTitle).toBe("事業者登録")
    expect(wrapper.vm.itemType).toBe("enterprise")
    expect(wrapper.vm.addModal).toBe(true)
    
    wrapper.destroy()
  })
  
  it ('add button clicked', () => {
    const wrapper = mount(Component, {
      attachToDocument: true,
      localVue: localVue
    })
    wrapper.find('.add-operator').trigger('click')

    // expect(wrapper.isVueInstance()).toBe(true)
    // const $modal = wrapper.find('div.modal')
    // expect($modal.exists()).toBe(true)
    // const outer = document.getElementById('modal1___BV_modal_outer_')
    // expect(outer).toBeDefined()
    // expect(outer.__vue__).toBeDefined()
    // expect(wrapper.contains('#modal1')).toBe(true)
    
    // console.log(wrapper.options);
    // console.log(wrapper.html());
    
    wrapper.destroy()
  })
})


describe('edit', () => {
  it ('add button clicked', () => { 
    const wrapper = mount(Component,{
      attachToDocument: true,
      localVue: localVue
    })
    wrapper.setData({ item: SampleData })
    console.log(wrapper.html());
    
    expect(wrapper.find('.fa-edit').isVisible()).toBe(false)
    wrapper.find('.fa-edit').trigger('click')
    
    expect(wrapper.vm.editModal).toBe(true)
    expect(wrapper.vm.itemToEdit.name).toBe("株式会社出雲")
    expect(wrapper.vm.itemToEdit.id).toBe(12345)

  })
})













