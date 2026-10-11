// 作者：小华同学AI。模板结构回归，不代替真机交互测试。
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const source = readFileSync(new URL('../pages/contract-detail/index.uvue', import.meta.url), 'utf8');
test('shared card defaults to participants and offers both tabs', () => {
  assert.match(source, /detailTab: 'participants'/);
  for (const tab of ['participants', 'timeline']) {
    assert.ok(source.includes(`@click="detailTab = '${tab}'"`));
    assert.ok(source.includes(`v-show="detailTab === '${tab}'"`));
  }
  assert.doesNotMatch(source, /showTimelinePopup|class="info-card timeline-entry"/);
});
test('all recorded events remain inside the shared card with bounded scrolling', () => {
  const popup = source.slice(source.indexOf('class="info-card participants-card"'), source.indexOf('<!-- 拒绝原因（如果有） -->'));
  assert.match(popup, /暂无参与人信息/);
  assert.match(popup, /scroll-y class="timeline-scroll"/);
  assert.match(popup, /v-for="event in contract.timeline"/);
  for (const text of ['event.occurredAt', 'event.actorName', 'event.detail', 'event.source', '暂无可核实的流程记录']) assert.ok(popup.includes(text));
  assert.match(source, /\.timeline-scroll \{ height: 600rpx; \}/);
});
