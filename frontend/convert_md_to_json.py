#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
将24种恋爱人格完整解读MD文件转换为JSON格式
"""

import json
import re
import sys
from pathlib import Path

MD_PATH = Path(r"C:\Users\Administrator\Desktop\临时\claude\mental-age\frontend\data\24种恋爱人格完整解读.md")
JSON_PATH = Path(r"C:\Users\Administrator\Desktop\临时\claude\mental-age\frontend\data\love-depth-personalities.json")

# 24种人格的元数据映射
PERSONALITY_META = {
    "安全-激情型": {"code": "secure_eros", "nickname": "炽热守护者", "emoji": "🔥"},
    "安全-友伴型": {"code": "secure_storge", "nickname": "暖阳伴侣", "emoji": "☀️"},
    "安全-游戏型": {"code": "secure_ludus", "nickname": "自由精灵", "emoji": "🦋"},
    "安全-占有型": {"code": "secure_mania", "nickname": "忠诚守护者", "emoji": "🛡️"},
    "安全-理性型": {"code": "secure_pragma", "nickname": "稳健领航者", "emoji": "🧭"},
    "安全-奉献型": {"code": "secure_agape", "nickname": "温柔港湾", "emoji": "🌊"},
    "焦虑-激情型": {"code": "anxious_eros", "nickname": "追光者", "emoji": "💫"},
    "焦虑-友伴型": {"code": "anxious_storge", "nickname": "渴望陪伴者", "emoji": "🌙"},
    "焦虑-游戏型": {"code": "anxious_ludus", "nickname": "试探者", "emoji": "🎭"},
    "焦虑-占有型": {"code": "anxious_mania", "nickname": "执念深情者", "emoji": "⚓"},
    "焦虑-理性型": {"code": "anxious_pragma", "nickname": "反复权衡者", "emoji": "⚖️"},
    "焦虑-奉献型": {"code": "anxious_agape", "nickname": "过度付出者", "emoji": "🕯️"},
    "疏离-激情型": {"code": "dismissive_eros", "nickname": "冷焰旅人", "emoji": "❄️"},
    "疏离-友伴型": {"code": "dismissive_storge", "nickname": "安静同行者", "emoji": "🚶"},
    "疏离-游戏型": {"code": "dismissive_ludus", "nickname": "随心浪子", "emoji": "🌊"},
    "疏离-占有型": {"code": "dismissive_mania", "nickname": "隐忍独行者", "emoji": "🏔️"},
    "疏离-理性型": {"code": "dismissive_pragma", "nickname": "独立远航者", "emoji": "⛵"},
    "疏离-奉献型": {"code": "dismissive_agape", "nickname": "克制守护者", "emoji": "🤫"},
    "恐惧-激情型": {"code": "fearful_eros", "nickname": "摇摆焰火", "emoji": "🎆"},
    "恐惧-友伴型": {"code": "fearful_storge", "nickname": "矛盾旅伴", "emoji": "🔄"},
    "恐惧-游戏型": {"code": "fearful_ludus", "nickname": "若即若离者", "emoji": "💨"},
    "恐惧-占有型": {"code": "fearful_mania", "nickname": "深渊凝视者", "emoji": "🌀"},
    "恐惧-理性型": {"code": "fearful_pragma", "nickname": "进退两难者", "emoji": "🔀"},
    "恐惧-奉献型": {"code": "fearful_agape", "nickname": "隐痛奉献者", "emoji": "💔"},
}

# 另一种nickname映射（MD文件中的昵称）
NICKNAME_MAP = {
    "炽热守护者": "secure_eros",
    "暖阳伴侣": "secure_storge",
    "自由精灵": "secure_ludus",
    "忠诚守护者": "secure_mania",
    "稳健领航者": "secure_pragma",
    "温柔港湾": "secure_agape",
    "追光者": "anxious_eros",
    "渴望陪伴者": "anxious_storge",
    "试探者": "anxious_ludus",
    "执念深情者": "anxious_mania",
    "反复权衡者": "anxious_pragma",
    "过度付出者": "anxious_agape",
    "冷焰旅人": "dismissive_eros",
    "安静同行者": "dismissive_storge",
    "随心浪子": "dismissive_ludus",
    "隐忍独行者": "dismissive_mania",
    "独立远航者": "dismissive_pragma",
    "克制守护者": "dismissive_agape",
    "摇摆焰火": "fearful_eros",
    "灼心追光者": "fearful_eros",
    "矛盾旅伴": "fearful_storge",
    "反复靠近者": "fearful_storge",
    "若即若离者": "fearful_ludus",
    "深渊凝视者": "fearful_mania",
    "暗夜守望者": "fearful_mania",
    "进退两难者": "fearful_pragma",
    "隐痛奉献者": "fearful_agape",
}

def read_md():
    with open(MD_PATH, 'r', encoding='utf-8') as f:
        return f.read()

def split_personality_sections(md_text):
    """将MD文本按人格分割，返回 {name: section_text}"""
    # 匹配 ## N. XXX-XXX型 · XXXX 格式的标题
    pattern = r'(?:^|\n)(?:## \d+\.\s*)([\u4e00-\u9fff]+-[^\n·]+?)·\s*([^\n]+)'
    matches = list(re.finditer(pattern, md_text))
    
    sections = {}
    for i, m in enumerate(matches):
        name = m.group(1).strip()
        nickname = m.group(2).strip()
        start = m.start()
        end = matches[i+1].start() if i+1 < len(matches) else len(md_text)
        section = md_text[start:end]
        
        # 如果同一个人格有多个版本，保留最长的
        if name not in sections or len(section) > len(sections[name]['text']):
            sections[name] = {'text': section, 'nickname': nickname}
    
    return sections

def extract_blockquote(text, after_pattern):
    """提取某个标题后的引用块内容"""
    match = re.search(after_pattern, text)
    if not match:
        return ""
    after = text[match.end():]
    # 找到下一个 > 开头的行或段落结束
    lines = after.split('\n')
    quote_lines = []
    for line in lines:
        stripped = line.strip()
        if stripped.startswith('>'):
            quote_lines.append(stripped.lstrip('> ').strip())
        elif stripped and not stripped.startswith('>') and not stripped.startswith('*') and not stripped.startswith('#'):
            if quote_lines:
                break
    return ''.join(quote_lines)

def extract_first_blockquote(text, section_start=None):
    """提取文本中第一个引用块"""
    if section_start:
        idx = text.find(section_start)
        if idx >= 0:
            text = text[idx:]
    
    lines = text.split('\n')
    quote_lines = []
    started = False
    for line in lines:
        stripped = line.strip()
        if stripped.startswith('>'):
            quote_lines.append(stripped.lstrip('> ').strip())
            started = True
        elif started and stripped == '':
            break
        elif started and not stripped.startswith('>'):
            break
    
    return ''.join(quote_lines)

def extract_keywords(text):
    """提取关键词行"""
    match = re.search(r'\*\*关键词\*\*\s*\n(.+)', text)
    if match:
        kw_line = match.group(1).strip()
        return [k.strip() for k in re.split(r'[·\s]+', kw_line) if k.strip()]
    return []

def extract_core_traits(text):
    """提取核心特质列表"""
    match = re.search(r'\*\*核心特质\*\*\s*\n((?:-\s+.+\n?)+)', text)
    if match:
        traits_block = match.group(1)
        traits = re.findall(r'-\s+(.+)', traits_block)
        return [t.strip() for t in traits]
    return []

def extract_paragraphs(text, start_pattern, end_patterns, min_len=20):
    """提取两个模式之间的段落文本"""
    match = re.search(start_pattern, text)
    if not match:
        return []
    
    after = text[match.end():]
    
    # 找到结束位置
    end_pos = len(after)
    for ep in end_patterns:
        ep_match = re.search(ep, after)
        if ep_match and ep_match.start() < end_pos:
            end_pos = ep_match.start()
    
    block = after[:end_pos]
    
    # 提取非空段落（排除标题、引用块、列表项）
    paragraphs = []
    current_para = []
    
    for line in block.split('\n'):
        stripped = line.strip()
        if stripped.startswith('#') or stripped.startswith('**一句话'):
            if current_para:
                para = ''.join(current_para).strip()
                if len(para) >= min_len:
                    paragraphs.append(para)
                current_para = []
            continue
        if stripped.startswith('>'):
            if current_para:
                para = ''.join(current_para).strip()
                if len(para) >= min_len:
                    paragraphs.append(para)
                current_para = []
            continue
        if stripped.startswith('- '):
            if current_para:
                para = ''.join(current_para).strip()
                if len(para) >= min_len:
                    paragraphs.append(para)
                current_para = []
            continue
        if stripped == '' or stripped == '***':
            if current_para:
                para = ''.join(current_para).strip()
                if len(para) >= min_len:
                    paragraphs.append(para)
                current_para = []
            continue
        # 普通文本行
        current_para.append(stripped)
    
    if current_para:
        para = ''.join(current_para).strip()
        if len(para) >= min_len:
            paragraphs.append(para)
    
    return paragraphs

def extract_insight(text, section_name):
    """提取某个章节的一句话洞察"""
    # 在特定章节后找引用块
    patterns = [
        rf'\*\*一句话洞察\*\*\s*\n>\s*(.+)',
        rf'###\s*{section_name}.*?\n.*?>\s*(.+)',
    ]
    for p in patterns:
        match = re.search(p, text, re.DOTALL)
        if match:
            return match.group(1).strip()
    return ""

def extract_needs_deep(text):
    """提取情感需求解读"""
    needs = []
    
    # 查找情感需求章节
    match = re.search(r'###\s*情感需求解读', text)
    if not match:
        return needs
    
    block = text[match.start():]
    # 找到下一个 ### 或 ##
    end_match = re.search(r'\n###\s*(?!情感)|\n##\s', block[5:])
    if end_match:
        block = block[:5 + end_match.start()]
    
    # 提取每个需求项 (序号. **名称**)
    need_matches = re.finditer(r'\*\*(\d+)\.\s*(.+?)\*\*', block)
    for nm in need_matches:
        need_name = nm.group(2).strip()
        # 提取该需求后面的描述段落
        after = block[nm.end():]
        # 下一个需求或章节结束
        next_need = re.search(r'\*\*\d+\.\s*', after)
        next_section = re.search(r'\n###|\n##', after)
        
        end_pos = len(after)
        if next_need:
            end_pos = min(end_pos, next_need.start())
        if next_section:
            end_pos = min(end_pos, next_section.start())
        
        desc_block = after[:end_pos].strip()
        # 取第一段非空文本作为描述
        desc_lines = []
        for line in desc_block.split('\n'):
            stripped = line.strip()
            if stripped and not stripped.startswith('#') and not stripped.startswith('**') and not stripped.startswith('>你的需求排序'):
                desc_lines.append(stripped)
        desc = ''.join(desc_lines[:3])  # 取前几段
        if not desc:
            desc = need_name
        
        needs.append({"name": need_name, "desc": desc})
    
    return needs

def extract_needs_order(text):
    """提取需求排序"""
    match = re.search(r'你的需求排序可能是[：:]\s*(.+)', text)
    if match:
        return match.group(1).strip()
    return ""

def extract_cycle(text):
    """提取关系循环模式"""
    # 提取典型循环
    cycle_match = re.search(r'\*\*典型循环\*\*[：:]\s*(.+?)(?:\n\n|\n\*\*)', text)
    cycle_text = cycle_match.group(1).strip() if cycle_match else ""
    
    # 提取循环步骤
    steps = []
    if cycle_text:
        # 按 → 分割
        steps = [s.strip() for s in re.split(r'→|->', cycle_text) if s.strip()]
    
    # 提取破局关键
    breakthrough_match = re.search(r'\*\*破局关键\*\*[：:]\s*(.+?)(?:\n\n|\n\*\*|\Z)', text, re.DOTALL)
    breakthrough = breakthrough_match.group(1).strip() if breakthrough_match else ""
    # 清理多余内容
    breakthrough = re.sub(r'\n+', ' ', breakthrough)
    breakthrough = breakthrough[:200]  # 限制长度
    
    # 提取健康循环详情和卡点详情
    healthy_detail = ""
    stuck_detail = ""
    
    return {
        "steps": steps,
        "healthyDetail": healthy_detail or "这个循环在健康状态下可以正向运转。",
        "stuckDetail": stuck_detail or "当循环卡住时,可能陷入重复模式无法突破。",
        "breakthrough": breakthrough
    }

def extract_match(name, text, match_type="best"):
    """提取匹配分析"""
    if match_type == "best":
        pattern = r'\*\*✅\s*(?:最佳匹配|相对较优匹配)[：:]\s*([^\n·]+?)·?\s*([^\n]+)'
    else:
        pattern = r'\*\*⚠️\s*挑战匹配[：:]\s*([^\n·]+?)·?\s*([^\n]+)'
    
    match = re.search(pattern, text)
    if not match:
        return {"name": "", "nickname": "", "reason": "", "detail": ""}
    
    match_name = match.group(1).strip()
    match_nickname = match.group(2).strip()
    
    # 提取后续详细描述
    after = text[match.end():]
    # 找到下一个匹配或章节
    end_match = re.search(r'\*\*[✅⚠️🪞🌱]|###|\*\*🪞', after)
    detail_text = after[:end_match.start()] if end_match else after[:500]
    
    # 清理和提取
    detail_paras = []
    for line in detail_text.split('\n'):
        stripped = line.strip()
        if stripped and not stripped.startswith('#') and not stripped.startswith('**'):
            detail_paras.append(stripped)
    detail = ''.join(detail_paras[:3])[:300] if detail_paras else ""
    
    # 提取reason（取第一段）
    reason = detail_paras[0][:100] if detail_paras else ""
    
    return {
        "name": match_name,
        "nickname": match_nickname,
        "reason": reason,
        "detail": detail
    }

def extract_blind_spot(text):
    """提取盲点觉察"""
    match = re.search(r'\*\*🪞\s*盲点觉察\*\*', text)
    if not match:
        return {"blindSpot": "", "blindSpotDetail": []}
    
    after = text[match.end():]
    end_match = re.search(r'\*\*🌱|\*\*🛤️|###', after)
    block = after[:end_match.start()] if end_match else after[:800]
    
    # 提取段落
    paras = []
    for line in block.split('\n'):
        stripped = line.strip()
        if stripped and not stripped.startswith('#') and not stripped.startswith('**🪞'):
            # 清理列表标记
            stripped = re.sub(r'^-\s+', '', stripped)
            if len(stripped) > 10:
                paras.append(stripped)
    
    blind_spot = paras[0][:150] if paras else ""
    return {
        "blindSpot": blind_spot,
        "blindSpotDetail": paras[:5]
    }

def extract_growth(text):
    """提取成长地图相关字段"""
    # 提取接纳部分
    acceptance_match = re.search(r'\*\*🌱\s*(?:第一步[：:]?\s*)?接纳\*\*\s*\n>\s*(.+?)(?:\n\n|\n\*\*)', text, re.DOTALL)
    acceptance = acceptance_match.group(1).strip() if acceptance_match else ""
    if not acceptance:
        acceptance_match = re.search(r'\*\*🌱\s*接纳\*\*\s*\n>\s*(.+?)(?:\n\n|\n\*\*)', text, re.DOTALL)
        acceptance = acceptance_match.group(1).strip() if acceptance_match else ""
    
    # 提取练习标题列表
    practices = []
    practice_matches = re.finditer(r'\*\*练习[一二三四][：:]\s*(.+?)\*\*', text)
    if not practice_matches:
        practice_matches = re.finditer(r'\d+\.\s*\*\*(.+?)\*\*', text)
    for pm in practice_matches:
        practices.append(pm.group(1).strip())
    
    # 提取练习详情
    practices_detail = []
    for i, pm in enumerate(list(re.finditer(r'(?:\*\*练习[一二三四][：:]\s*.+?\*\*|\d+\.\s*\*\*.+?\*\*)', text))):
        after = text[pm.end():]
        # 找到下一个练习或章节
        next_p = re.search(r'(?:\*\*练习[一二三四]|###|\*\*🌈)', after)
        block = after[:next_p.start()] if next_p else after[:500]
        
        # 提取标题
        title_match = re.search(r'\*\*(.+?)\*\*', pm.group(0))
        title = title_match.group(1) if title_match else f"练习{i+1}"
        
        # 提取内容
        content_lines = []
        for line in block.split('\n'):
            stripped = line.strip()
            if stripped and not stripped.startswith('#') and not stripped.startswith('**'):
                stripped = re.sub(r'^-\s+', '', stripped)
                content_lines.append(stripped)
        content = ''.join(content_lines[:3])[:300] if content_lines else ""
        
        practices_detail.append({"title": title, "content": content})
    
    # 提取蜕变/愿景
    vision_match = re.search(r'\*\*🌈\s*(?:第三步[：:]?\s*)?蜕变\*\*\s*\n>\s*(.+?)(?:\n\n|\n\*\*|\Z)', text, re.DOTALL)
    vision = vision_match.group(1).strip() if vision_match else ""
    if not vision:
        vision_match = re.search(r'\*\*🌈\s*蜕变\*\*\s*\n>\s*(.+?)(?:\n\n|\n\*\*|\Z)', text, re.DOTALL)
        vision = vision_match.group(1).strip() if vision_match else ""
    
    # 提取第一步（接纳之前的文字）
    step1_match = re.search(r'\*\*🌱\s*(?:第一步[：:]?\s*)?接纳\*\*', text)
    step1 = ""
    if step1_match:
        before = text[max(0, step1_match.start()-300):step1_match.start()]
        # 取最后一段非空文本
        for line in reversed(before.split('\n')):
            stripped = line.strip()
            if stripped and not stripped.startswith('#') and not stripped.startswith('**') and len(stripped) > 10:
                step1 = stripped
                break
    
    return {
        "step1": step1 or acceptance[:100],
        "acceptanceDetail": acceptance,
        "practices": practices,
        "practicesDetail": practices_detail,
        "vision": vision
    }

def extract_closing(text):
    """提取结尾寄语"""
    match = re.search(r'###\s*结尾寄语', text)
    if not match:
        return {"message": "", "detail": []}
    
    after = text[match.end():]
    # 找到下一个 ## 或文件结束
    end_match = re.search(r'\n##|\Z', after)
    block = after[:end_match.start()] if end_match else after
    
    # 提取引用块内容
    quote_lines = []
    for line in block.split('\n'):
        stripped = line.strip()
        if stripped.startswith('>'):
            quote_lines.append(stripped.lstrip('> ').strip())
    
    message = quote_lines[0] if quote_lines else ""
    detail = quote_lines if quote_lines else []
    
    return {"message": message, "detail": detail}

def parse_personality(name, section_text, nickname_from_header):
    """解析单个人格的完整JSON结构"""
    meta = PERSONALITY_META.get(name, {})
    code = meta.get("code", "")
    nickname = meta.get("nickname", nickname_from_header)
    emoji = meta.get("emoji", "")
    
    # 提取各部分内容
    one_liner = extract_first_blockquote(section_text, "核心画像")
    if not one_liner:
        one_liner = extract_first_blockquote(section_text, "一句话定义")
    
    keywords = extract_keywords(section_text)
    core_traits = extract_core_traits(section_text)
    
    # 依恋维度深度解读
    attach_paras = extract_paragraphs(section_text, 
        r'###\s*依恋维度深度解读',
        [r'###\s*恋爱风格深度解读', r'###\s*关系循环', r'###\s*匹配分析', r'###\s*成长地图', r'###\s*结尾寄语', r'###\s*情感需求'])
    attach_insight = ""
    # 在依恋章节后找一句话洞察
    attach_section_match = re.search(r'###\s*依恋维度深度解读', section_text)
    if attach_section_match:
        attach_section = section_text[attach_section_match.start():]
        insight_match = re.search(r'\*\*一句话洞察\*\*\s*\n>\s*(.+)', attach_section)
        if insight_match:
            attach_insight = insight_match.group(1).strip()
        if not attach_insight:
            # 找依恋章节中的第一个引用块
            attach_insight = extract_first_blockquote(attach_section[:2000], "依恋维度")
    
    # 恋爱风格深度解读
    style_paras = extract_paragraphs(section_text,
        r'###\s*恋爱风格深度解读',
        [r'###\s*关系循环', r'###\s*匹配分析', r'###\s*成长地图', r'###\s*结尾寄语', r'###\s*情感需求'])
    style_insight = ""
    style_section_match = re.search(r'###\s*恋爱风格深度解读', section_text)
    if style_section_match:
        style_section = section_text[style_section_match.start():]
        insight_match = re.search(r'\*\*一句话洞察\*\*\s*\n>\s*(.+)', style_section)
        if insight_match:
            style_insight = insight_match.group(1).strip()
        if not style_insight:
            style_insight = extract_first_blockquote(style_section[:2000], "恋爱风格")
    
    # 情感需求
    needs_deep = extract_needs_deep(section_text)
    needs_order = extract_needs_order(section_text)
    
    # 关系循环
    cycle = extract_cycle(section_text)
    
    # 匹配分析
    best_match = extract_match(name, section_text, "best")
    challenge_match = extract_match(name, section_text, "challenge")
    
    # 盲点
    blind_spot_data = extract_blind_spot(section_text)
    
    # 成长
    growth = extract_growth(section_text)
    
    # 结尾
    closing = extract_closing(section_text)
    
    return {
        "code": code,
        "name": name,
        "nickname": nickname,
        "emoji": emoji,
        "oneLiner": one_liner,
        "keywords": keywords,
        "coreTraits": core_traits,
        "attachmentDeep": attach_paras,
        "attachmentInsight": attach_insight,
        "styleDeep": style_paras,
        "styleInsight": style_insight,
        "needsDeep": needs_deep,
        "needsOrder": needs_order,
        "cycleSteps": cycle["steps"],
        "cycleHealthyDetail": cycle["healthyDetail"],
        "cycleStuckDetail": cycle["stuckDetail"],
        "breakthrough": cycle["breakthrough"],
        "breakthroughDetail": cycle["breakthrough"],
        "bestMatch": best_match,
        "challengeMatch": challenge_match,
        "blindSpot": blind_spot_data["blindSpot"],
        "blindSpotDetail": blind_spot_data["blindSpotDetail"],
        "growthStep1": growth["step1"],
        "growthAcceptanceDetail": growth["acceptanceDetail"],
        "growthPractices": growth["practices"],
        "growthPracticesDetail": growth["practicesDetail"],
        "growthVision": growth["vision"],
        "growthTransformationDetail": growth["vision"],
        "closingMessage": closing["message"],
        "closingDetail": closing["detail"]
    }

def main():
    print("读取MD文件...")
    md_text = read_md()
    print(f"MD文件大小: {len(md_text)} 字符")
    
    print("\n分割人格章节...")
    sections = split_personality_sections(md_text)
    print(f"找到 {len(sections)} 个人格章节:")
    for name, data in sections.items():
        print(f"  - {name} · {data['nickname']} ({len(data['text'])} 字符)")
    
    print("\n解析并生成JSON...")
    result = {}
    for name, data in sections.items():
        print(f"  解析: {name}...")
        personality = parse_personality(name, data['text'], data['nickname'])
        code = personality['code']
        if code:
            result[code] = personality
        else:
            print(f"    ⚠️ 未找到code映射: {name}")
    
    print(f"\n共生成 {len(result)} 个人格JSON")
    
    # 验证完整性
    missing = []
    for code, meta in PERSONALITY_META.items():
        if meta["code"] not in result:
            missing.append(meta["code"])
    
    if missing:
        print(f"\n[!] 缺少以下人格: {missing}")
    else:
        print("\n[OK] 所有24种人格都已生成")
    
    # 写入JSON文件
    print(f"\n写入JSON文件: {JSON_PATH}")
    with open(JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    
    print(f"JSON文件大小: {JSON_PATH.stat().st_size} 字节")
    print("\n[DONE] 完成!")

if __name__ == "__main__":
    main()
