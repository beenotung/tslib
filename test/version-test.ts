import { getSemverDiffType, SemverDiffType, to_semver } from '../src/semver';
import * as test from 'tape';

test('semver', t => {
  t.equal(getSemverDiffType(
    to_semver('1.1.9'),
    to_semver('1.1.9')),
    SemverDiffType.same);
  t.equal(getSemverDiffType(
    to_semver('1.1.9'),
    to_semver('1.1.13')),
    SemverDiffType.newer);
  t.equal(getSemverDiffType(
    to_semver('1.1.13'),
    to_semver('1.1.9')),
    SemverDiffType.compatible);
  t.equal(getSemverDiffType(
    to_semver('1.1.13'),
    to_semver('1.0.0')),
    SemverDiffType.compatible);
  t.equal(getSemverDiffType(
    to_semver('1.1.9'),
    to_semver('0.1.10')),
    SemverDiffType.breaking);
  t.end();
});
