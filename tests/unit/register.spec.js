import { mount, shallowMount, createLocalVue } from '@vue/test-utils'
import Component from '@/views/Register.vue'
import BootstrapVue from 'bootstrap-vue'
import HotTable from '@handsontable/vue'
import SampleData from '@/sample_data.js'

const localVue = createLocalVue()
localVue.use(BootstrapVue)
localVue.use(HotTable)


//add
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

    // const outer = document.getElementById('modal1___BV_modal_outer_')
    // expect(outer).toBeDefined()
    // expect(outer.__vue__).toBeDefined()
    
    wrapper.destroy()
  })
})



//edit
describe('edit', () => {
  const wrapper = mount(Component,{
    attachToDocument: true,
    localVue: localVue
  })
  wrapper.setData({ item: SampleData })
  // console.log(wrapper.html());
  
  it ('modal has to be open, data has to be emitted', () => {
    expect(wrapper.find('.fa-edit').isVisible()).toBe(false)
    wrapper.find('.fa-edit').trigger('click')
  
    expect(wrapper.vm.editModal).toBe(true)
    expect(wrapper.vm.itemToEdit).not.toBeUndefined()
    expect(wrapper.vm.editInput).not.toBeUndefined()
    
    const outer = document.getElementById('__BVID__21___BV_modal_outer_')
    expect(outer).toBeDefined()

    wrapper.setData({ editInput: {id:123, name:"テスト"} })
    expect(wrapper.vm.itemToEdit.id).not.toBe(wrapper.vm.editInput.id)
    expect(wrapper.vm.itemToEdit.name).not.toBe(wrapper.vm.editInput.name)

    document.getElementById('save').click()
    expect(wrapper.vm.editModal).toBe(false)
      
    expect(wrapper.vm.itemToEdit.id).toBe(wrapper.vm.editInput.id)
    expect(wrapper.vm.itemToEdit.name).toBe(wrapper.vm.editInput.name)
    wrapper.destroy()
  })
})



//delete
describe('delete', () => {
  const wrapper = mount(Component,{
    attachToDocument: true,
    localVue: localVue
  })
  wrapper.setData({ item: SampleData })
  it ('modal has to be open, data has to be emitted', () => {
    expect(wrapper.find('.fa-trash-alt').isVisible()).toBe(false)
    wrapper.find('.fa-trash-alt').trigger('click')

    expect(wrapper.vm.deleteModal).toBe(true)
    expect(wrapper.vm.itemToDelete.parent).not.toBeUndefined()
    expect(wrapper.vm.itemToDelete.child).not.toBeUndefined()
  })

  it ('data has to be deleted from parent node', () => {
    expect(wrapper.vm.itemToDelete.parent.item).toContain(wrapper.vm.itemToDelete.child)
    document.getElementById('ok').click()

    expect(wrapper.vm.deleteModal).toBe(false)
    expect(wrapper.vm.itemToDelete.parent.item).not.toContain(wrapper.vm.itemToDelete.child)
  })
})










