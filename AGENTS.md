# Daily Quiet Time 작업 지침

UI를 설계·구현·수정하는 작업을 시작할 때는 사용자가 별도로 요청하지 않아도 [compare-ui-designs](.agents/skills/compare-ui-designs/SKILL.md)를 읽고 따른다. 화면의 목적에 맞는 서비스 사례를 비교하고, 선택한 패턴을 프로젝트에 맞게 적용한다.

새 화면을 만들거나 기존 화면을 전면 개편할 때는 사례 비교로 디자인 방향을 정한 뒤, 구현에 앞서 [image-to-code](.agents/skills/image-to-code/SKILL.md)를 읽고 따른다. 선택한 디자인 방향과 실제 화면에 들어갈 콘텐츠로 시안 이미지를 생성하고, 시안의 배치·타이포그래피·간격을 분석해 UI로 구현한다.

서비스 소개 페이지를 만들거나 개편할 때는 `compare-ui-designs`로 사례를 비교한 뒤 [design-taste-frontend](.agents/skills/design-taste-frontend/SKILL.md)를 읽고 섹션 순서와 레이아웃을 정한다. 그 구성을 바탕으로 `image-to-code`로 시안을 만들어 구현한다. 완성된 페이지를 로컬에서 열고 `design-taste-frontend`의 브라우저 검사 도구로 모바일과 데스크톱 레이아웃을 확인한다.

UI를 구현하거나 수정한 뒤에는 [web-design-guidelines](.agents/skills/web-design-guidelines/SKILL.md)로 변경한 UI 파일을 검토한다. 최신 Vercel 지침을 기준으로 접근성, 키보드 포커스, 입력 폼 등을 점검하고 발견 사항을 `파일:줄` 형식으로 기록한다.

코드 검토 후, 실행 가능한 UI의 동작이 바뀌었다면 [agent-browser](.agents/skills/agent-browser/SKILL.md)로 로컬 개발 서버에서 해당 사용자 흐름을 검증한다. 예를 들어 저장 기능은 값을 입력하고 저장한 뒤 새로고침해 값이 유지되는지 확인한다. CLI는 `npx --yes agent-browser@0.43.0`으로 실행한다. 최초 환경에서는 `install`로 테스트 브라우저를 준비하고, `skills get core`로 사용법을 확인한다. 작업 전용 `--session`을 사용하고 검증 후 `close`로 닫는다.
