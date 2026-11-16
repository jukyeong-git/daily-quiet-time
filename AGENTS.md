# Daily Quiet Time 작업 지침

UI를 설계·구현·수정할 때는 [compare-ui-designs](.agents/skills/compare-ui-designs/SKILL.md)를 읽고 화면 목적에 맞는 서비스 사례를 비교한다.

새 화면을 만들거나 기존 화면을 전면 개편할 때는 다음 순서로 작업한다. 각 단계가 끝날 때마다 무엇을 했는지 한 줄로 알린다.

1. 프로젝트 루트의 `DESIGN.md`를 읽고 색과 글꼴 기준을 파악한다. 파일이 없으면 기존 UI와 요청에서 기준을 확인하고, 문서가 없다는 사실을 알린다.
2. [image-to-code](.agents/skills/image-to-code/SKILL.md)로 참고 화면을 먼저 만들고 분석한다.
3. [design-taste-frontend](.agents/skills/design-taste-frontend/SKILL.md)의 기준을 참고해 화면을 구현한다.
4. [agent-browser](.agents/skills/agent-browser/SKILL.md)로 실제 화면을 열어 캡처하고 참고 화면과 어긋난 곳을 수정한다. 사용자 동작이 바뀌었다면 해당 흐름도 확인한다.
5. [web-design-guidelines](.agents/skills/web-design-guidelines/SKILL.md)로 변경한 UI 파일을 검사하고 지적 사항을 수정한다.

작은 UI 수정에도 관련 디자인 사례를 참고하고 `web-design-guidelines`로 변경 파일을 검토한다. 실행 가능한 UI의 동작이 바뀌면 `agent-browser`로 해당 사용자 흐름을 확인한다. CLI는 `npx --yes agent-browser@0.43.0`으로 실행한다. 최초 환경에서는 `install`로 테스트 브라우저를 준비하고, `skills get core`로 사용법을 확인한다. 작업 전용 `--session`을 사용하고 검증 후 `close`로 닫는다.
