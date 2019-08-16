import { mount, shallowMount, createLocalVue } from '@vue/test-utils'
import flushPromises from 'flush-promises'
import Component from '@/views/Register.vue'
import BootstrapVue from 'bootstrap-vue'
import HotTable from '@handsontable/vue'
import SampleData from '@/sample_data.js'

const localVue = createLocalVue()
localVue.use(BootstrapVue)
localVue.use(HotTable)


describe('add', () => {
  
  // it ('values have to be set after button is clicked', () => {
  //   const wrapper = mount(Component, {
  //     attachToDocument: true,
  //     localVue: localVue
  //   })
  //   wrapper.find('#add-operator').trigger('click')
  //   expect(wrapper.vm.modalTitle).toBe("事業者登録")
  //   expect(wrapper.vm.itemType).toBe("enterprise")
  //   expect(wrapper.vm.addModal).toBe(true)
  // })
  
  it ('add button clicked', async() => {
    const wrapper = mount(Component, {
      attachToDocument: true,
      localVue: localVue
    })
    wrapper.find('#add-operator').trigger('click')
    expect(wrapper.vm.$refs.hotTable).not.toBeUndefined()
    
    const hotTable = wrapper.vm.$refs.hotTable.hotInstance
    //hotTable.setDataAtCell([[0,1,'test']])
    //hotTable.setDataAtCell(0, 0, '1');
    
    wrapper.vm.$refs.colId._data
    console.log(wrapper.vm.$refs.colId);
    
    console.log(hotTable.getDataAtCol(0));
  

    document.getElementById('add-button').click()
    //wrapper.vm.addButtonClicked()
    await flushPromises()
    
    //error
    // console.log(wrapper.vm.errors);
    // expect(wrapper.vm.errors).toEqual([])
    
  
    console.log(wrapper.vm.item);
    // console.log(wrapper.vm.item[0].id);
    // console.log(wrapper.vm.item[0].name);
    
    // console.log(wrapper.vm.loading);
    // console.log(wrapper.vm.addModal);
    // expect(wrapper.vm.addModal).toBe(false)
  })
})













// describe('edit item with edit icon', () => {
//   const wrapper = mount(Component,{
//     attachToDocument: true,
//     localVue: localVue
//   })
//   wrapper.setData({ item: SampleData })
// 
//   it ('data should be emitted from child component', () => {    
//     expect(wrapper.find('.fa-edit').isVisible()).toBe(false)
//     wrapper.find('.fa-edit').trigger('click')
// 
//     expect(wrapper.vm.editModal).toBe(true)
//     const outer = document.getElementById('__BVID__21___BV_modal_outer_')
//     expect(outer).toBeDefined()
// 
//     expect(wrapper.vm.itemToEdit).not.toBeUndefined()
//     expect(wrapper.vm.editInput).not.toBeUndefined()
//   })
// 
//   it ('data should be updated', () => {    
//     wrapper.setData({ editInput: {id:123, name:"テスト"} })
//     expect(wrapper.vm.itemToEdit.id).not.toBe(wrapper.vm.editInput.id)
//     expect(wrapper.vm.itemToEdit.name).not.toBe(wrapper.vm.editInput.name)
// 
//     document.getElementById('update').click()
//     expect(wrapper.vm.editModal).toBe(false)
// 
//     expect(wrapper.vm.itemToEdit.id).toBe(wrapper.vm.editInput.id)
//     expect(wrapper.vm.itemToEdit.name).toBe(wrapper.vm.editInput.name)
//   })
// })
// 
// describe('delete item', () => {
//   const wrapper = mount(Component,{
//     attachToDocument: true,
//     localVue: localVue
//   })
//   wrapper.setData({ item: SampleData })
// 
//   it ('data should be emitted from child component', () => {
//     expect(wrapper.find('.fa-trash-alt').isVisible()).toBe(false)
//     wrapper.find('.fa-trash-alt').trigger('click')
// 
//     expect(wrapper.vm.deleteModal).toBe(true)
//     expect(wrapper.vm.itemToDelete.parent).not.toBeUndefined()
//     expect(wrapper.vm.itemToDelete.child).not.toBeUndefined()
//   })
// 
//   it ('data should be deleted from parent node', () => {
//     expect(wrapper.vm.itemToDelete.parent.item).toContain(wrapper.vm.itemToDelete.child)
//     document.getElementById('ok').click()
// 
//     expect(wrapper.vm.deleteModal).toBe(false)
//     expect(wrapper.vm.itemToDelete.parent.item).not.toContain(wrapper.vm.itemToDelete.child)
//   })
// })





