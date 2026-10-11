// 作者：小华同学AI。用页面实际菜单方法验证分派和权限，不代替真机测试。
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const source = readFileSync(new URL('../pages/contract-detail/index.uvue', import.meta.url), 'utf8');
const methods = source.slice(source.indexOf('\thasMoreActions()'), source.indexOf('\tcanFillForm():'))
  .replace(/: boolean/g, '').replace(/: string\[\]/g, '');
function setup(flags = {}) {
  let sheet;
  const calls = [];
  const page = { ...new Function('uni', `return ({${methods}})` )({ showActionSheet: options => { sheet = options; } }),
    contract: { status: flags.completed ? 3 : 2 }, STATUS_COMPLETED: 3,
    canShare: () => !!flags.share, canCancel: () => !!flags.cancel, canDelete: () => !!flags.delete,
    handleShare: () => calls.push('share'), handleCancel: () => calls.push('cancel'),
    handleDelete: () => calls.push('delete'), handleAIAudit: () => calls.push('audit') };
  page.handleMoreActions();
  return { page, calls, sheet };
}
test('signing menu preserves sharing and cancellation handlers', () => {
  const { sheet, calls } = setup({ share: true, cancel: true });
  assert.deepEqual(sheet.itemList, ['分享链接', '撤销合同']);
  sheet.success({ tapIndex: 0 }); sheet.success({ tapIndex: 1 });
  assert.deepEqual(calls, ['share', 'cancel']);
});
test('completed menu retains audit and deletion', () => {
  const { sheet, calls } = setup({ completed: true, delete: true });
  assert.deepEqual(sheet.itemList, ['AI审查', '删除合同']);
  sheet.success({ tapIndex: 0 }); sheet.success({ tapIndex: 1 });
  assert.deepEqual(calls, ['audit', 'delete']);
});
test('revoked permission does not dispatch and empty menu is hidden', () => {
  const { page, sheet, calls } = setup({ cancel: true });
  page.canCancel = () => false;
  sheet.success({ tapIndex: 0 });
  assert.deepEqual(calls, []);
  const empty = setup();
  assert.equal(empty.page.hasMoreActions(), false);
  assert.equal(empty.sheet, undefined);
});
