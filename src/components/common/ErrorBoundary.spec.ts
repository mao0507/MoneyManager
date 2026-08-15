// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import ErrorBoundary from './ErrorBoundary.vue'

const ThrowingChild = defineComponent({
  render() {
    throw new Error('boom')
  },
})

describe('ErrorBoundary', () => {
  it('renders the default slot untouched when no error occurs', () => {
    const wrapper = mount(ErrorBoundary, {
      slots: { default: () => h('div', 'healthy child') },
    })

    expect(wrapper.text()).toBe('healthy child')
  })

  it('renders the fallback UI instead of letting the child error propagate', async () => {
    const wrapper = mount(ErrorBoundary, {
      slots: { default: () => h(ThrowingChild) },
    })
    await nextTick()

    expect(wrapper.text()).toContain('Something went wrong')
  })
})
