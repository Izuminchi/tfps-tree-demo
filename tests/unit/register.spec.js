import { mount, shallowMount, createLocalVue } from '@vue/test-utils'
import Component from '@/views/Register.vue'
import BootstrapVue from 'bootstrap-vue'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

let wrapper;
beforeEach(() => {
  wrapper = mount(Component, { localVue: localVue })
});
afterEach(() => {
  wrapper.destroy()
});

describe('追加機能のテスト', () => {
    it ('事業者追加', async() => {
      wrapper.find('#add-enterprise').trigger('click')
      expect(wrapper.vm.modalTitle).toBe("事業者")
      expect(wrapper.vm.itemType).toBe("enterprise")
      expect(wrapper.vm.addModal).toBe(true)
      expect(wrapper.vm.$refs.hotTable).toBeDefined()

      const hotTable = wrapper.vm.$refs.hotTable.hotInstance
      hotTable.loadData([[1,'enterprise_1']]);
      document.getElementById('add-button').click()

      expect(wrapper.vm.loading).toBe(true)
      await new Promise(resolve => setTimeout(resolve));

      expect(wrapper.vm.errors.length).toBe(0)
      expect(wrapper.vm.item[0]).toEqual({id:1, name:'enterprise_1', type:'enterprise'})
      expect(wrapper.vm.loading).toBe(false)
      expect(wrapper.vm.addModal).toBe(false)
    })

  it ('加盟店追加', async() => {
    wrapper.setData({ item: [{id: null, name: 'name_1', type: 'enterprise'}] })
    const enterprise = wrapper.vm.item[0]

    const addBtn = wrapper.findAll('#add-child').filter(w=>w.text()=='加盟店を追加する')
    expect(addBtn.length).not.toBe(0)
    expect(enterprise.merchants).toBeUndefined()

    addBtn.at(0).trigger('click')
    expect(wrapper.vm.modalTitle).toBe("加盟店")
    expect(wrapper.vm.itemType).toBe("merchant")
    expect(enterprise.merchants).toBeDefined()
    expect(enterprise.merchants.length).toBe(0)
    expect(wrapper.vm.addModal).toBe(true)
    expect(wrapper.vm.itemToAdd).toEqual(enterprise)

    const hotTable = wrapper.vm.$refs.hotTable.hotInstance
    hotTable.loadData([[1,'merchant_1']]);
    document.getElementById('add-button').click()
    await new Promise(resolve => setTimeout(resolve));

    expect(enterprise.merchants.length).toBe(1)
    expect(enterprise.merchants[0]).toEqual({id: 1, name:'merchant_1', type:'merchant'})
  })

  it ('設置店舗追加', async() => {
    wrapper.setData({ item: [
      { id: 1, name: 'enterprise_1', type: 'enterprise', merchants: [
        { id: 1, name: 'merchant_1', type: 'merchant' }]
      }] 
    })
    const merchant = wrapper.vm.item[0].merchants[0]

    const addBtn = wrapper.findAll('#add-child').filter(w=>w.text()=='設置店舗を追加する')
    expect(addBtn.length).not.toBe(0)
    expect(merchant.stores).toBeUndefined()

    addBtn.at(0).trigger('click')
    expect(wrapper.vm.modalTitle).toBe("設置店舗")
    expect(wrapper.vm.itemType).toBe("store")
    expect(merchant.stores).toBeDefined()
    expect(merchant.stores.length).toBe(0)
    expect(wrapper.vm.addModal).toBe(true)
    expect(wrapper.vm.itemToAdd).toEqual(merchant)

    const hotTable = wrapper.vm.$refs.hotTable.hotInstance
    hotTable.loadData([[1,'store_1', 10]]);
    document.getElementById('add-button').click()
    await new Promise(resolve => setTimeout(resolve));

    expect(merchant.stores.length).toBe(1)
    expect(merchant.stores[0]).toEqual({id:1, name:'store_1', type:'store', terminals: 10})
  })
})

describe('追加のバリデーションテスト', () => {

  it ('ID重複不可　inputのみ', () => {
    wrapper.find('#add-enterprise').trigger('click')
    const hotTable = wrapper.vm.$refs.hotTable.hotInstance
    hotTable.loadData([['1', null],['1', null]]);

    expect(wrapper.vm.errors.length).toBe(0)
    document.getElementById('add-button').click()
    expect(wrapper.vm.errors.length).toBe(1)
    expect(wrapper.vm.errors[0]).toBe("IDが重複しています")
    expect(wrapper.vm.loading).toBe(false)
    expect(wrapper.vm.addModal).toBe(true)
  })

  it ('新規の名称重複不可 inputのみ', () => {
    wrapper.find('#add-enterprise').trigger('click')
    const hotTable = wrapper.vm.$refs.hotTable.hotInstance
    hotTable.loadData([[null,'test'],[null,'test']]);

    expect(wrapper.vm.errors.length).toBe(0)
    document.getElementById('add-button').click()
    expect(wrapper.vm.errors.length).toBe(1)
    expect(wrapper.vm.errors[0]).toBe("名称が重複しています")
    expect(wrapper.vm.loading).toBe(false)
    expect(wrapper.vm.addModal).toBe(true)
  })

  it ('ID重複不可 追加済みとinput', () => {
    wrapper.setData({ item: [{id: 1, name: 'name_1', type: 'enterprise'}] })
    wrapper.find('#add-enterprise').trigger('click')
    const hotTable = wrapper.vm.$refs.hotTable.hotInstance
    hotTable.loadData([[1 , null]]);

    document.getElementById('add-button').click()
    expect(wrapper.vm.errors.length).toBe(1)
    expect(wrapper.vm.errors[0]).toBe("IDが重複しています")
  })

  it ('新規の名称重複不可 追加済みとinput', () => {
    wrapper.setData({ item: [{ name: 'name_1', type: 'enterprise'}] })
    wrapper.find('#add-enterprise').trigger('click')
    const hotTable = wrapper.vm.$refs.hotTable.hotInstance
    hotTable.loadData([[null , 'name_1']]);

    document.getElementById('add-button').click()
    expect(wrapper.vm.errors.length).toBe(1)
    expect(wrapper.vm.errors[0]).toBe("名称が重複しています")
  })

  it ('端末台数6000台まで', async() => {
    wrapper.setData({ 
      item: [
        { id:1, name:'enterprise_1', type:'enterprise', merchants: 
          [{ id:1, name:'merchant_1', type:'merchant' }]
        }]
    })
    const addBtn = wrapper.findAll('#add-child').filter(w=>w.text()=='設置店舗を追加する')
    addBtn.at(0).trigger('click')
    const hotTable = wrapper.vm.$refs.hotTable.hotInstance
    hotTable.loadData([[1,'store_1', 6000]]);
    document.getElementById('add-button').click()

    expect(wrapper.vm.errors.length).toBe(0)

    await new Promise(resolve => setTimeout(resolve));
    const terminals = wrapper.vm.item[0].merchants[0].stores[0].terminals

    expect(terminals).toBeLessThanOrEqual(6000)

    addBtn.at(0).trigger('click')
    hotTable.loadData([[2,'store_2', 1]]);
    document.getElementById('add-button').click()

    expect(wrapper.vm.errors.length).toBe(1)
    expect(wrapper.vm.errors[0]).toBe("一度に登録可能な端末の最大数(6000)をオーバーしています")
  })
})

describe('編集機能のテスト', () => {

  it ('詳細編集', () => {
    wrapper.setData({ item: [{id: null, name: 'name_1', type: 'enterprise'}] })
    expect(wrapper.find('.fa-edit').isVisible()).toBe(false)
    wrapper.find('.fa-edit').trigger('click')

    expect(wrapper.vm.editModal).toBe(true)
    expect(wrapper.vm.itemToEdit).toBeDefined()
    expect(wrapper.vm.editInput).toBeDefined()

    wrapper.setData({ editInput: {id:123, name:"テスト"} })

    expect(wrapper.vm.itemToEdit.item.id).not.toBe(wrapper.vm.editInput.id)
    expect(wrapper.vm.itemToEdit.item.name).not.toBe(wrapper.vm.editInput.name)

    document.getElementById('update').click()

    expect(wrapper.vm.editModal).toBe(false)
    expect(wrapper.vm.itemToEdit.item.id).toBe(wrapper.vm.editInput.id)
    expect(wrapper.vm.itemToEdit.item.name).toBe(wrapper.vm.editInput.name)
  })
  
  it ('簡易編集', async() => {
    wrapper.setData({ item: [{id: 1, name: 'enterprise_1', type: 'enterprise'}] })

    const oldSpan = wrapper.findAll('span.id')
    const oldText = wrapper.findAll('span.id').at(0).text()

    oldSpan.at(0).trigger('click')

    expect(wrapper.findAll('span.id').length).toBe(oldSpan.length-1)
    expect(wrapper.findAll('input.id').length).toBe(1)

    wrapper.findAll('input.id').at(0).setValue('123')
    await new Promise(resolve => setTimeout(resolve));
    wrapper.findAll('input.id').at(0).trigger('keyup.enter')

    expect(wrapper.findAll('span.id').length).toBe(oldSpan.length)
    expect(wrapper.findAll('input.id').length).toBe(0)
    expect(wrapper.find('span.id').text()).not.toBe(oldText)
    expect(wrapper.vm.item[0].id).toBe(123)
  })
})

describe('簡易編集のバリデーションテスト', () => {

  it ('ID重複不可', async() => {
    wrapper.setData({ item: [
      { id: 1, name: 'name_1', type: 'enterprise'},
      { id: 2, name: 'name_2', type: 'enterprise'}]
    })
    const oldText = wrapper.find('span.id').text()
    wrapper.find('span.id').trigger('click')

    wrapper.find('input.id').setValue(2)
    await new Promise(resolve => setTimeout(resolve));
    wrapper.find('input.id').trigger('keyup.enter')

    expect(wrapper.find('span.id').text()).not.toBe(2)
    expect(wrapper.find('span.id').text()).toBe(oldText)
  })

  it ('新規の名称重複不可', async() => {
    wrapper.setData({ item: [
      { name: 'name_1', type: 'enterprise'},
      { name: 'name_2', type: 'enterprise'}]
    })
    const oldText = wrapper.find('span.name').text()
    wrapper.find('span.name').trigger('click')
    
    wrapper.find('input.name').setValue('name_2')
    await new Promise(resolve => setTimeout(resolve));
    wrapper.find('input.name').trigger('keyup.enter')

    expect(wrapper.find('span.name').text()).not.toBe('name_2')
    expect(wrapper.find('span.name').text()).toBe(oldText)
  })
  
  it ('IDがある場合名称重複可', async() => {
    wrapper.setData({ item: [
      { id: 1, name: 'name_1', type: 'enterprise'},
      { id: 2, name: 'name_2', type: 'enterprise'}]
    })
    const oldText = wrapper.find('span.name').text()
    wrapper.find('span.name').trigger('click')
    
    wrapper.find('input.name').setValue('name_2')
    await new Promise(resolve => setTimeout(resolve));
    wrapper.find('input.name').trigger('keyup.enter')

    expect(wrapper.find('span.name').text()).toBe('name_2')
  })
  
  it ('IDか名称のどちらか必須', async() => {
    wrapper.setData({ item: [{id: null, name: 'name_1', type: 'enterprise'}] })
    const oldText = wrapper.find('span.name').text()
    wrapper.find('span.name').trigger('click')
    
    wrapper.find('input.name').setValue('')
    await new Promise(resolve => setTimeout(resolve));
    wrapper.find('input.name').trigger('keyup.enter')
    
    expect(wrapper.find('span.name').text()).toBe('name_1')
  })
  
  it ('端末台数6000台まで', async() => {
    wrapper.setData({ item: [
      { id: 1, name: 'enterprise_1', type: 'enterprise', merchants: [
          { id: 1, name: 'merchant_1', type: 'merchant', stores: [
              { id: null, name: 'store_1', type: 'store', terminals: 10 }]
          }]
      }]
    })
    wrapper.find('span.terminal').trigger('click')
    
    wrapper.find('input.terminal').setValue(6001)
    await new Promise(resolve => setTimeout(resolve));
    wrapper.find('input.terminal').trigger('keyup.enter')
    
    expect(wrapper.find('span.terminal').text()).not.toBe('6001台')
    expect(wrapper.find('span.terminal').text()).toBe('10台')
    
    wrapper.find('span.terminal').trigger('click')
    wrapper.find('input.terminal').setValue(6000)
    await new Promise(resolve => setTimeout(resolve));
    wrapper.find('input.terminal').trigger('keyup.enter')
    
    expect(wrapper.find('span.terminal').text()).toBe('6000台')
  })
})

describe('詳細編集のバリデーションテスト', () => {
  
  beforeEach(() => {
    wrapper.setData({ item: [
      { id: 1, name: 'enterprise_1', type: 'enterprise', merchants: [
          { id: 1, name: 'merchant_1', type: 'merchant', stores: [
              { id: null, name: 'store_1', type: 'store', terminals: 10 },
              { id: null, name: 'store_2', type: 'store', terminals: 10 }]
          },
          {id: 2, name: 'merchant_2', type: 'merchant' }]
      }]
    })
  });

  it('ID重複不可', () => {
    wrapper.findAll('.fa-edit').at(1).trigger('click')
    wrapper.vm.editInput.id = 2    
    document.getElementById('update').click()
    
    expect(wrapper.vm.errors.length).toBe(1)
    expect(wrapper.vm.errors[0]).toBe('IDが重複しています')
    expect(wrapper.vm.editModal).toBe(true)
  })

  it('新規の名称重複不可', () => {
    wrapper.findAll('.fa-edit').at(2).trigger('click')
    wrapper.vm.editInput.name = 'store_2'
    document.getElementById('update').click()
    
    expect(wrapper.vm.errors.length).toBe(1)
    expect(wrapper.vm.errors[0]).toBe('名称が重複しています')
  })
  
  it('IDがある場合名称重複可', () => {
    wrapper.findAll('.fa-edit').at(1).trigger('click')
    wrapper.vm.editInput.name = 'merchant_2'
    document.getElementById('update').click()
    
    expect(wrapper.vm.errors.length).toBe(0)
    expect(wrapper.vm.item[0].merchants[0].name).toBe('merchant_2')
  })
  
  it('IDか名称のどちらか必須', () => {
    wrapper.findAll('.fa-edit').at(1).trigger('click')
    wrapper.vm.editInput.id = ''
    wrapper.vm.editInput.name = ''
    document.getElementById('update').click()
    
    expect(wrapper.vm.errors.length).toBe(1)
    expect(wrapper.vm.errors[0]).toBe('IDまたは名称のどちらかを記入してください')
  })
  
  it('端末台数6000台まで', () => {
    wrapper.findAll('.fa-edit').at(2).trigger('click')
    wrapper.vm.editInput.terminals = 6000
    document.getElementById('update').click()
    
    expect(wrapper.vm.errors.length).toBe(1)
    expect(wrapper.vm.errors[0]).toBe('一度に登録可能な端末の最大数(6000)をオーバーしています')
  })
})
 
describe('削除機能のテスト', () => {

  it ('削除アイコンクリックで削除', () => {
    wrapper.setData({ item: [
      { id: 1, name: 'name_1', type: 'enterprise'},
      { id: 2, name: 'name_2', type: 'enterprise'}]
    })
    expect(wrapper.find('.fa-trash-alt').isVisible()).toBe(false)
    wrapper.find('.fa-trash-alt').trigger('click')
    const oldItem = wrapper.vm.item.length

    expect(wrapper.vm.deleteModal).toBe(true)
    expect(wrapper.vm.itemToDelete.parent).not.toBeUndefined()
    expect(wrapper.vm.itemToDelete.child).not.toBeUndefined()

    expect(wrapper.vm.itemToDelete.parent.item).toContain(wrapper.vm.itemToDelete.child)
    document.getElementById('ok').click()

    expect(wrapper.vm.deleteModal).toBe(false)
    expect(wrapper.vm.itemToDelete.parent.item).not.toContain(wrapper.vm.itemToDelete.child)
    expect(wrapper.vm.item.length).not.toBe(oldItem)
  })
})





